import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile, login, logout, registerStudent } from "@/api";


export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
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
