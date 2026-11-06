export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthTokensResponse {
    accessToken: string;
    fullName?: string;
    roles?: string[];
}

export interface RegistrationDocument {
    uri: string;
    name: string;
    mimeType?: string | null;
}

export interface RegisterStudentRequest {
    fullName: string;
    studentCode: string;
    email: string;
    phoneNumber: string;
    password: string;
    registrationCode: string;
    major?: string;
    citizenIdFile: RegistrationDocument;
    studentCardFile: RegistrationDocument;
}

export interface ForgotPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
}

/*
 * Backend tạo JWT với:
 * sub   = email/username
 * id    = user ID
 * roles = danh sách quyền
 * exp   = thời gian hết hạn
 */
export interface JwtPayload {
    sub: string;
    id: string;
    roles: string[];
    iat: number;
    exp: number;
}

export interface AuthSession {
    userId: string;
    email: string;
    fullName?: string;
    roles: string[];
    accessToken: string;
}

export interface AuthIdentity {
    fullName?: string;
    roles?: string[];
}
