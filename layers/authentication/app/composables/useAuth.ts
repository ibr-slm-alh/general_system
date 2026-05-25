import { ref } from "vue";
import { navigateTo, useCookie } from "#app";

import { useAuthStore } from "../stores/authStore";
import { authenticationService } from "../services/authentication.service";

import {
  loginSchema,
  type loginSchema as LoginSchema,
} from "../schemas/auth.schema";

export function useAuth() {
  const store = useAuthStore();

  const loading = ref(false);
  const error = ref("");

  async function initAuth() {
    const token = useCookie<string | null>("auth_token");

    if (!token.value) {
      return;
    }

    try {
      const response = await authenticationService().me();

      store.setAuth(response.data);
    } catch (err) {
      console.log("initAuth error:", err);

      token.value = null;

      // store.clearAuth();
    }
  }

  async function login(payload: LoginSchema) {
    try {
      loading.value = true;
      error.value = "";

      const validated = loginSchema.safeParse(payload);

      if (!validated.success) {
        error.value = validated.error.issues[0]?.message || "Validation failed";
        return;
      }

      await authenticationService().login(payload);

      await navigateTo("/");
    } catch (err: any) {
      console.log("login error:", err);

      error.value =
        err?.data?.message ||
        err?.response?._data?.message ||
        err?.message ||
        "Login failed";
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    const authService = authenticationService();

    try {
      await authService.logout();

      store.clearAuth();

      await navigateTo("/authentication/login");
    } catch (err) {
      console.log("logout error:", err);
    }
  }

  return {
    initAuth,
    login,
    loading,
    error,
    logout,
  };
}
