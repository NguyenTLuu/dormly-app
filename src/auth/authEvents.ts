type UnauthorizedListener = () => void;

let unauthorizedListener: UnauthorizedListener | null = null;

export function setUnauthorizedListener(
    listener: UnauthorizedListener | null
): void {
    unauthorizedListener = listener;
}

export function emitUnauthorized(): void {
    unauthorizedListener?.();
}
