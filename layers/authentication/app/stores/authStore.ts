import { defineStore } from "pinia";
import type { User, Permission } from "../../../authorization/app/types/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  const permissions = ref<Permission[]>([]);

  const token = useCookie<string | null>("auth_token", {
    default: () => null,
  });

  const isAuthenticated = computed(() => !!token.value);

  const setAuth = (payload: { user: User; access_token: string }) => {
    user.value = payload.user;

    permissions.value =
      payload.user.roles?.flatMap((role: any) => role.permissions || []) || [];

    token.value = payload.access_token;
  };

  const setUser = (payload: User) => {
    user.value = payload;
  };

  const clearAuth = () => {
    user.value = null;
    permissions.value = [];
    token.value = null;
  };

  return {
    user,
    permissions,
    token,
    isAuthenticated,
    setAuth,
    setUser,
    clearAuth,
  };
});
