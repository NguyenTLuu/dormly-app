import type {
    ManagedAssignment,
    ManagedNode,
    ManagedNodeType,
    RoomManagementData,
    RoomGender,
} from '@/types/roomManagement';

export function nodeLevel(node: ManagedNode, data: RoomManagementData) {
    return data.nodeTypes.find((type) => type.id === node.nodeTypeId)?.level;
}

export function isRoom(node: ManagedNode, data: RoomManagementData) {
    const type = data.nodeTypes.find((item) => item.id === node.nodeTypeId);
    return type ? nodeTypeKind(type, data.nodeTypes) === 'room' : false;
}

export function nodeTypeKind(type: ManagedNodeType, types: ManagedNodeType[]) {
    const name = type.name.trim().toUpperCase();
    if (name === 'ROOM') return 'room';
    if (name === 'FLOOR') return 'floor';
    if (name === 'BUILDING' || name === 'BLOCK') return 'building';
    const levels = [...new Set(types.map((item) => item.level))].sort(
        (a, b) => a - b
    );
    if (levels.length >= 3 && type.level === levels[levels.length - 1])
        return 'room';
    if (levels.length >= 3 && type.level === levels[levels.length - 2])
        return 'floor';
    return type.level === levels[0] ? 'building' : 'other';
}

export function nodeAncestors(node: ManagedNode, nodes: ManagedNode[]) {
    const ancestors: ManagedNode[] = [];
    const visited = new Set([node.id]);
    let parentId = node.parentId;
    while (parentId && !visited.has(parentId)) {
        visited.add(parentId);
        const parent = nodes.find((item) => item.id === parentId);
        if (!parent) break;
        ancestors.push(parent);
        parentId = parent.parentId;
    }
    return ancestors;
}

export function nodePath(node: ManagedNode, data: RoomManagementData) {
    return [...nodeAncestors(node, data.nodes).reverse(), node]
        .map((item) => item.name)
        .join(' / ');
}

export function effectiveGender(
    node: ManagedNode,
    data: RoomManagementData
): RoomGender | null {
    return (
        [node, ...nodeAncestors(node, data.nodes)].find(
            (item) => item.genderPolicy
        )?.genderPolicy ?? null
    );
}

export function activeAssignment(
    assignment: ManagedAssignment,
    at = Date.now()
) {
    return (
        new Date(assignment.startDate).getTime() <= at &&
        (!assignment.endDate || new Date(assignment.endDate).getTime() > at)
    );
}

export function isResidentRole(roles: string[]) {
    return roles.some(
        (role) => role.toUpperCase().replace(/^ROLE_/, '') === 'USER'
    );
}

export function roomAllowsAssignment(node: ManagedNode) {
    return (
        !node.status ||
        ['ENABLE', 'ACTIVE', 'AVAILABLE', 'VACANT', 'OPEN'].includes(
            node.status.toUpperCase()
        )
    );
}

export function hasAssignmentCapacity(
    assignments: ManagedAssignment[],
    roomId: string,
    userId: string,
    start: string,
    end: string | undefined,
    capacity: number
) {
    const begin = new Date(start).getTime();
    const finish = end ? new Date(end).getTime() : Infinity;
    const events: { time: number; delta: number }[] = [
        { time: begin, delta: 1 },
    ];
    for (const assignment of assignments) {
        if (assignment.roomNodeId !== roomId || assignment.userId === userId)
            continue;
        const arrival = new Date(assignment.startDate).getTime();
        const departure = assignment.endDate
            ? new Date(assignment.endDate).getTime()
            : Infinity;
        if (arrival >= finish || departure <= begin) continue;
        events.push({ time: Math.max(begin, arrival), delta: 1 });
        if (departure < finish) events.push({ time: departure, delta: -1 });
    }
    events.sort((a, b) => a.time - b.time || a.delta - b.delta);
    let occupants = 0;
    return events.every((event) => {
        occupants += event.delta;
        return occupants <= capacity;
    });
}

export function parseAssignmentDate(value: string): string | null {
    const normalized = value.trim().replace(' ', 'T');
    if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/.test(normalized))
        return null;
    const withTime =
        normalized.length === 10
            ? `${normalized}T00:00:00`
            : normalized.length === 16
              ? `${normalized}:00`
              : normalized;
    const parsed = new Date(withTime);
    return Number.isFinite(parsed.getTime()) &&
        localDateTime(parsed) === withTime
        ? withTime
        : null;
}

export function localDateTime(date = new Date()) {
    const pad = (value: number) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
