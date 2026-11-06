const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const roomManagement = require('../src/utils/room-management.ts');
const source = fs.readFileSync(
    path.join(process.cwd(), 'src/utils/operational-insights.ts'),
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
const { roomInsights, ticketInsights } = exportsForTest;

test('room statistics use actual level-4 rooms, not seeded level-3 floors', () => {
    const asOf = new Date('2026-10-26T10:00:00').getTime();
    const data = {
        asOf,
        nodeTypes: [
            { id: 'B', name: 'Building', level: 1 },
            { id: 'F', name: 'Floor', level: 3 },
            { id: 'R', name: 'Room', level: 4 },
        ],
        nodes: [
            { id: 'building', name: 'A', nodeTypeId: 'B' },
            { id: 'floor', name: '1', nodeTypeId: 'F', parentId: 'building' },
            {
                id: 'room1',
                name: '101',
                nodeTypeId: 'R',
                parentId: 'floor',
                maxCapacity: 1,
            },
            {
                id: 'room2',
                name: '102',
                nodeTypeId: 'R',
                parentId: 'floor',
                maxCapacity: 2,
            },
        ],
        assignments: [
            {
                id: 'a',
                roomNodeId: 'room1',
                userId: 'u',
                startDate: '2026-01-01T00:00:00',
            },
            {
                id: 'b',
                roomNodeId: 'room2',
                userId: 'v',
                startDate: '2026-11-01T00:00:00',
            },
        ],
        users: [],
    };
    const summary = roomInsights(data);
    assert.equal(summary.totalRooms, 2);
    assert.equal(summary.totalBeds, 3);
    assert.equal(summary.occupiedBeds, 1);
    assert.equal(summary.vacantBeds, 2);
    assert.equal(summary.fullRooms, 1);
    assert.equal(summary.byBuilding[0].floors[0].occupied, 1);
});

test('ticket statistics do not invent categories when no tickets exist', () => {
    assert.deepEqual(ticketInsights([]).categories, []);
    const summary = ticketInsights([
        { id: '1', status: 'OPEN', category: 'FACILITY' },
        { id: '2', status: 'RESOLVED', category: 'FACILITY' },
    ]);
    assert.deepEqual(summary.categories, [{ label: 'FACILITY', count: 2 }]);
    assert.equal(
        summary.statuses.find((item) => item.label === 'OPEN').count,
        1
    );
});
