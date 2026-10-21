import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  getUsers,
  login,
  logout,
  promoteUserToMentor,
  registerStudent,
} from "@/api";
import type { GetUsersQuery } from "@/types";


export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });
}

export function useGetUsers(query: GetUsersQuery) {
  return useQuery({
    queryKey: ["users", query],
    queryFn: () => getUsers(query),
  });
}

export function usePromoteUserToMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promoteUserToMentor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useLogin() {
  return useMutation({ mutationFn: login });
}

export function useRegisterStudent() {
  return useMutation({ mutationFn: registerStudent });
}

export function useLogout() {
  return useMutation({ mutationFn: logout });
}
