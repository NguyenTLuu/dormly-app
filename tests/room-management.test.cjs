const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
    activeAssignment,
    effectiveGender,
    hasAssignmentCapacity,
    isResidentRole,
    isRoom,
    nodeAncestors,
    nodeTypeKind,
    parseAssignmentDate,
} = require('../src/utils/room-management.ts');

const types = [
    { id: 'b', name: 'Building', level: 1 },
    { id: 'f', name: 'Floor', level: 3 },
    { id: 'r', name: 'Room', level: 4 },
];
const building = {
    id: 'B',
    name: 'Block A',
    nodeTypeId: 'b',
    genderPolicy: 'FEMALE',
};
const floor = { id: 'F', name: 'Floor 1', nodeTypeId: 'f', parentId: 'B' };
const room = { id: 'R', name: '101', nodeTypeId: 'r', parentId: 'F' };
const data = {
    nodeTypes: types,
    nodes: [building, floor, room],
    users: [],
    assignments: [],
};
const assignment = (userId, startDate, endDate) => ({
    id: userId,
    userId,
    roomNodeId: 'R',
    startDate,
    endDate,
});

test('seed hierarchy uses Building 1, Floor 3, Room 4 without treating floors as rooms', () => {
    assert.equal(isRoom(floor, data), false);
    assert.equal(isRoom(room, data), true);
    assert.equal(nodeTypeKind(types[1], types), 'floor');
});

test('gender is inherited through ancestors and a room override wins', () => {
    assert.equal(effectiveGender(room, data), 'FEMALE');
    assert.equal(
        effectiveGender({ ...room, genderPolicy: 'MIXED' }, data),
        'MIXED'
    );
});

test('cyclic backend hierarchy does not hang ancestor traversal', () => {
    assert.equal(
        nodeAncestors(room, [room, { ...floor, parentId: 'R' }]).length,
        1
    );
});

test('scheduled and ended stays do not count as current occupancy', () => {
    const at = new Date('2026-10-23T12:00:00').getTime();
    assert.equal(
        activeAssignment(assignment('a', '2026-10-24T00:00:00'), at),
        false
    );
    assert.equal(
        activeAssignment(
            assignment('a', '2026-10-01T00:00:00', '2026-10-23T12:00:00'),
            at
        ),
        false
    );
    assert.equal(
        activeAssignment(assignment('a', '2026-10-01T00:00:00'), at),
        true
    );
});

test('capacity checks future overlap, excludes the moving resident and unrelated rooms', () => {
    const stays = [
        assignment('a', '2026-11-01', '2026-12-01'),
        assignment('b', '2026-11-01'),
        { ...assignment('c', '2026-11-01'), roomNodeId: 'OTHER' },
    ];
    assert.equal(
        hasAssignmentCapacity(stays, 'R', 'new', '2026-11-10', undefined, 2),
        false
    );
    assert.equal(
        hasAssignmentCapacity(stays, 'R', 'a', '2026-11-10', undefined, 2),
        true
    );
});

test('a departure and arrival at the same moment do not overlap', () => {
    const stays = [
        assignment('a', '2026-11-01', '2026-11-10'),
        assignment('b', '2026-11-10', '2026-11-20'),
    ];
    assert.equal(
        hasAssignmentCapacity(stays, 'R', 'new', '2026-11-01', '2026-11-20', 2),
        true
    );
    assert.equal(
        hasAssignmentCapacity(stays, 'R', 'new', '2026-11-01', '2026-11-20', 1),
        false
    );
});

test('date validation rejects rolled-over calendar dates and invalid times', () => {
    assert.equal(parseAssignmentDate('2026-02-30'), null);
    assert.equal(parseAssignmentDate('2026-10-23T24:30'), null);
    assert.equal(parseAssignmentDate('2028-02-29'), '2028-02-29T00:00:00');
    assert.equal(
        parseAssignmentDate('2026-10-23T09:30'),
        '2026-10-23T09:30:00'
    );
});

test('only USER accounts are resident choices, including backend prefix/case', () => {
    assert.equal(isResidentRole(['User']), true);
    assert.equal(isResidentRole(['ROLE_USER']), true);
    assert.equal(isResidentRole(['STAFF', 'ADMIN']), false);
});
