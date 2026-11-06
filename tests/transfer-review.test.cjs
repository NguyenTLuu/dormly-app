const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const roomManagement = require('../src/utils/room-management.ts');

const source = fs.readFileSync(
    path.join(process.cwd(), 'src/utils/transfer-review.ts'),
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
const { transferDestinationError } = exportsForTest;

const start = '2026-10-26T10:00:00';
const asOf = new Date(start).getTime();
const request = {
    id: 'T',
    userId: 'U',
    fromRoomId: 'OLD',
    status: 'PENDING',
    reason: 'Need another room',
};
const old = {
    id: 'OLD',
    name: '101',
    nodeTypeId: 'room',
    maxCapacity: 2,
    currentOccupancy: 1,
};
const target = {
    id: 'NEW',
    name: '102',
    nodeTypeId: 'room',
    maxCapacity: 2,
    currentOccupancy: 0,
};
const resident = {
    id: 'U',
    fullName: 'Resident',
    email: 'resident@example.com',
    isActive: true,
    roles: ['USER'],
    gender: 'FEMALE',
};
const current = {
    id: 'A',
    userId: 'U',
    roomNodeId: 'OLD',
    startDate: '2026-01-01T00:00:00',
};
const base = {
    asOf,
    nodes: [old, target],
    nodeTypes: [{ id: 'room', name: 'Room', level: 4 }],
    users: [resident],
    assignments: [current],
};

test('approval requires a different operational destination and a current stay', () => {
    assert.match(
        transferDestinationError(request, base, old, start),
        /different/
    );
    assert.match(
        transferDestinationError(
            request,
            base,
            { ...target, status: 'DISABLED' },
            start
        ),
        /available/
    );
    assert.match(
        transferDestinationError(
            request,
            { ...base, assignments: [] },
            target,
            start
        ),
        /exactly one/
    );
    assert.equal(transferDestinationError(request, base, target, start), null);
});

test('approval blocks full or gender-incompatible rooms and inactive residents', () => {
    const full = {
        ...base,
        assignments: [
            ...base.assignments,
            {
                id: 'B',
                userId: 'OTHER',
                roomNodeId: 'NEW',
                startDate: '2026-01-01T00:00:00',
            },
            {
                id: 'C',
                userId: 'OTHER2',
                roomNodeId: 'NEW',
                startDate: '2026-01-01T00:00:00',
            },
        ],
    };
    assert.match(
        transferDestinationError(request, full, target, start),
        /full/
    );
    assert.match(
        transferDestinationError(
            request,
            base,
            { ...target, genderPolicy: 'MALE' },
            start
        ),
        /gender/
    );
    assert.match(
        transferDestinationError(
            request,
            { ...base, users: [{ ...resident, isActive: false }] },
            target,
            start
        ),
        /active USER/
    );
});

test('a previously moved resident can finish pending review in their current room only', () => {
    const moved = { ...base, assignments: [{ ...current, roomNodeId: 'NEW' }] };
    assert.equal(transferDestinationError(request, moved, target, start), null);
    assert.match(
        transferDestinationError(
            request,
            moved,
            { ...target, id: 'THIRD' },
            start
        ),
        /already moved/
    );
});

test('scheduled stays prevent a new transfer from silently closing them', () => {
    const scheduled = {
        ...base,
        assignments: [
            ...base.assignments,
            {
                id: 'F',
                userId: 'U',
                roomNodeId: 'OLD',
                startDate: '2026-11-01T00:00:00',
            },
        ],
    };
    assert.match(
        transferDestinationError(request, scheduled, target, start),
        /scheduled/
    );
});
