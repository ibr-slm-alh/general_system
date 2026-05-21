import { defineStore } from "pinia";
import type { User, Permission } from "../../../authorization/app/types/auth";
import { authenticationService } from "~~/layers/authentication/app/services/authentication.service";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  const permissions = ref<Permission[]>([]);

  const token = useCookie<string | null>("auth_token", {
    // default: () => null,
  });

  const isAuthenticated = computed(() => !!token.value);

  const setAuth = (payload: {
    user: User;
    permissions: Permission[];
    access_token: string;
  }) => {
    user.value = payload.user;
    permissions.value = payload.permissions;
    token.value = payload.access_token;
  };

  const setUser = (payload) => {
    user.value = payload;
  };

  const clearAuth = () => {
    user.value = null;
    permissions.value = [];
    token.value = null;
  };

  const logoutRequest = async () => {
    const { logoutRequest: apiLogout } = authenticationService();

    if (token.value) {
      await apiLogout(token.value);
    }

    clearAuth();

    await navigateTo("authentication/login");
  };

  return {
    user,
    permissions,
    token,
    isAuthenticated,
    setAuth,
    setUser,
    clearAuth,
    logoutRequest,
  };
});
