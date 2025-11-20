export interface User {
    username: string;
    email: string;
    password: string;

    failedAttempts?: number;
    lockUntil?: number | null;
}
