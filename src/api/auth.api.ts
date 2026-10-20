import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  LoginPayload,
  RegisterStudentPayload,
  Role,
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
