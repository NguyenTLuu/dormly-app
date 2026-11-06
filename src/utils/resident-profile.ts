export function profileBirthDate(
    value: string,
    now = new Date()
): string | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const parsed = new Date(`${value}T00:00:00`);
    const pad = (part: number) => String(part).padStart(2, '0');
    const date = `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
    return Number.isFinite(parsed.getTime()) && date === value && parsed <= now
        ? `${value}T00:00:00`
        : null;
}

export function residentContactError(
    name: string,
    phone: string,
    birthDate: string,
    hadPhone: boolean,
    hadBirthDate: boolean,
    now = new Date()
): string | null {
    if (!name.trim()) return 'Enter the resident name.';
    if (name.trim().length > 255) return 'The name is too long.';
    if (hadPhone && !phone.trim())
        return 'This API cannot clear an existing phone number.';
    if (
        phone.trim() &&
        (!/^\+?[0-9]{10,15}$/.test(phone.trim()) || phone.trim().length > 15)
    )
        return 'Enter a phone number with 10–15 digits.';
    if (hadBirthDate && !birthDate.trim())
        return 'This API cannot clear an existing birth date.';
    if (birthDate.trim() && !profileBirthDate(birthDate.trim(), now))
        return 'Enter a valid past birth date (YYYY-MM-DD).';
    return null;
}
