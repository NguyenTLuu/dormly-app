const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const roomManagement = require('../src/utils/room-management.ts');
const source = fs.readFileSync(
    path.join(process.cwd(), 'src/utils/automatic-room.ts'),
    'utf8'
);
const compiled = ts.transpileModule(source, {
    compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
    },
}).outputText;
const exportsForTest = {};
new Function('require', 'exports', compiled)((name) => {
    assert.equal(name, './room-management');
    return roomManagement;
}, exportsForTest);
const { chooseAutomaticRoom, backendCanAutoAssign } = exportsForTest;

const now = new Date('2026-10-26T10:00:00').getTime();
const room = (id, status = 'ENABLE', occupancy = 0, genderPolicy = null) => ({
    id,
    name: id,
    nodeTypeId: 'room',
    status,
    maxCapacity: 4,
    currentOccupancy: occupancy,
    genderPolicy,
});
const data = {
    asOf: now,
    nodeTypes: [{ id: 'room', name: 'Room', level: 4 }],
    nodes: [room('101', 'ENABLE', 1), room('102'), room('201', 'ENABLE', 1)],
    users: [{ id: 'U', roles: ['USER'], isActive: true, gender: 'FEMALE' }],
    assignments: [],
};
const start = '2026-10-26T10:00:00';

test('legacy ENABLE rooms from the seeded database remain usable for app auto selection', () => {
    assert.equal(chooseAutomaticRoom(data, 'U', start)?.id, '102');
    assert.equal(backendCanAutoAssign(data, 'U'), false);
});

test('already assigned residents can move automatically to another room', () => {
    const assigned = {
        ...data,
        assignments: [
            {
                id: 'A',
                userId: 'U',
                roomNodeId: '102',
                startDate: '2026-01-01T00:00:00',
            },
        ],
    };
    assert.equal(chooseAutomaticRoom(assigned, 'U', start)?.id, '101');
    assert.equal(backendCanAutoAssign(assigned, 'U'), false);
});

test('capacity, policy and scheduled stays reject unsafe automatic placement', () => {
    const unsafe = {
        ...data,
        nodes: [
            room('101', 'DISABLED'),
            room('102', 'ENABLE', 4),
            room('201', 'ENABLE', 0, 'MALE'),
        ],
    };
    assert.equal(chooseAutomaticRoom(unsafe, 'U', start), null);
    const scheduled = {
        ...data,
        assignments: [
            {
                id: 'A',
                userId: 'U',
                roomNodeId: '101',
                startDate: '2026-11-01T00:00:00',
            },
        ],
    };
    assert.equal(chooseAutomaticRoom(scheduled, 'U', start), null);
});

test('rooms without mixed policy do not mix resident genders', () => {
    const occupied = {
        ...data,
        nodes: [room('102')],
        users: [
            ...data.users,
            { id: 'M', roles: ['USER'], isActive: true, gender: 'MALE' },
        ],
        assignments: [
            {
                id: 'A',
                userId: 'M',
                roomNodeId: '102',
                startDate: '2026-01-01T00:00:00',
            },
        ],
    };
    assert.equal(chooseAutomaticRoom(occupied, 'U', start), null);
});
