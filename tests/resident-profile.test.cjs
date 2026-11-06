const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
    profileBirthDate,
    residentContactError,
} = require('../src/utils/resident-profile.ts');

test('birth-date validation rejects rollover and future dates', () => {
    const now = new Date('2026-10-26T12:00:00');
    assert.equal(profileBirthDate('2004-02-29', now), '2004-02-29T00:00:00');
    assert.equal(profileBirthDate('2003-02-29', now), null);
    assert.equal(profileBirthDate('2027-01-01', now), null);
});

test('contact edit does not promise clearing values the backend ignores', () => {
    const now = new Date('2026-10-26T12:00:00');
    assert.match(
        residentContactError('Resident', '', '', true, false, now),
        /cannot clear/
    );
    assert.match(
        residentContactError('Resident', '0123456789', '', false, true, now),
        /cannot clear/
    );
    assert.equal(
        residentContactError(
            'Resident',
            '0123456789',
            '2004-01-01',
            true,
            true,
            now
        ),
        null
    );
});
