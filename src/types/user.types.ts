export interface User {
    name: string;
    email: string;
    id: string;
    created_at: string;
    updated_at: string;
    role: Role;
    user_status: UserStatus;
    batch_id: string | null;
}

export type Role = "ADMIN" | "MENTOR" | "STUDENT"
export type UserStatus = "ACTIVE" | "BAN"