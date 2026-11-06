const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseInboxEvent, mergeInboxItems, personalInboxItems } = require('../src/utils/app-notifications.ts');
const event = { eventId: 'one', recipient: 'resident@example.com', channel: 'WEBSOCKET', subject: 'Room notice', message: 'Inspect tomorrow', createdAt: '2026-11-02T10:00:00' };
test('inbox ignores other accounts and email delivery records', () => {
    const rows = [event, { ...event, eventId: 'two', recipient: 'other@example.com' }, { ...event, eventId: 'three', channel: 'EMAIL' }];
    assert.deepEqual(personalInboxItems(rows, 'RESIDENT@example.com').map((item) => item.id), ['one']);
});
test('live STOMP and stored history merge once by event ID in newest-first order', () => {
    const live = parseInboxEvent({ ...event, createdAt: undefined, timestamp: event.createdAt });
    const stored = parseInboxEvent(event);
    const newer = parseInboxEvent({ ...event, eventId: 'new', createdAt: '2026-11-02T11:00:00' });
    assert.deepEqual(mergeInboxItems([live], [stored, newer]).map((item) => item.id), ['new', 'one']);
});
test('malformed socket events cannot become inbox items', () => {
    for (const value of [null, {}, { ...event, eventId: '' }, { ...event, message: null }, { ...event, createdAt: 'invalid' }, { ...event, channel: 'SMS' }]) assert.equal(parseInboxEvent(value), null);
});

test('priority survives both WebSocket metadata and stored log responses', () => {
    for (const priority of ['Normal', 'Important', 'Emergency']) {
        assert.equal(parseInboxEvent({ ...event, metadata: { priority } }).priority, priority);
        assert.equal(parseInboxEvent({ ...event, priority: priority.toUpperCase() }).priority, priority);
    }
});

test('missing or unknown priorities stay unspecified without guessing from content', () => {
    for (const value of [undefined, null, 'URGENT', {}, 1]) {
        assert.equal(parseInboxEvent({ ...event, subject: 'Emergency', priority: value }).priority, undefined);
    }
    assert.equal(parseInboxEvent({ ...event, metadata: 'Emergency' }).priority, undefined);
});

test('history without priority does not erase live priority during deduplication', () => {
    const live = parseInboxEvent({ ...event, metadata: { priority: 'Emergency' } });
    const legacy = parseInboxEvent(event);
    assert.equal(mergeInboxItems([live], [legacy])[0].priority, 'Emergency');
    assert.equal(mergeInboxItems([legacy], [live])[0].priority, 'Emergency');
});
