import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  LoginPayload,
  RegisterStudentPayload,
  Role,
  GetUsersQuery,
  User,
} from "@/types";

const prefix = '/auth'

export const login = (credentials: LoginPayload) => {
  return apiClient<ApiResponse<{ accessToken: string, role: Role }>>(`${prefix}/login`, {
    method: "POST",
    body: credentials,
  });
}

export const registerStudent = (
  input: RegisterStudentPayload,
) => {
  return apiClient<ApiResponse<{ accessToken: string, role: Role }>>(`${prefix}/signup`, {
    method: "POST",
    body: input,
  });
}

export const logout = () => {
  return apiClient<ApiResponse<undefined>>(`${prefix}/logout`, {
    method: "POST",
  });
}

export const getProfile = () => {
  return apiClient<ApiResponse<User>>("/auth/me")
}

export const getUsers = ({ page, limit, searchTerm, role }: GetUsersQuery) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (searchTerm) query.set("searchTerm", searchTerm);
  if (role) query.set("role", role.toLowerCase());
  return apiClient<ApiResponse<User[]>>(`${prefix}/users?${query.toString()}`);
};

export const promoteUserToMentor = (userId: string) => {
  return apiClient<ApiResponse<User>>(
    `${prefix}/${encodeURIComponent(userId)}/mentor`,
    { method: "PATCH" },
  );
};
