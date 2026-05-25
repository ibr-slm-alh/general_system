import { useAuthStore } from "../stores/authStore";

import type {
  RegisterPayload,
  RegisterResponse,
  LoginResponse,
  LogoutResponse,
} from "../../../authorization/app/types/auth";

export function authenticationService() {
  const { $api } = useNuxtApp();

  const authStore = useAuthStore();

  async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    return await $api<RegisterResponse>("/register", {
      method: "POST",
      body: payload,
    });
  }

  async function login(payload: { email: string; password: string }) {
    const response = await $api<LoginResponse>("/login", {
      method: "POST",
      body: payload,
    });

    const { user, tokens } = response.data;

    authStore.setAuth({
      user,
      access_token: tokens.access_token,
    });

    return response;
  }

  async function logout() {
    await $api<LogoutResponse>("/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    authStore.clearAuth();
  }

  async function me() {
    const response = await $api("/me");

    authStore.setUser(response.data);

    return response;
  }

  async function forgetPassword(email: string) {
    return await $api(`/forget-password`, {
      method: "POST",
      body: { email },
      headers: {
        Accept: "application/json",
      },
    });
  }

  async function resetPassword(payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return await $api(`/reset-password`, {
      method: "POST",
      body: payload,
      headers: {
        Accept: "application/json",
      },
    });
  }

  return {
    register,
    login,
    logout,
    me,
    forgetPassword,
    resetPassword,
  };
}
