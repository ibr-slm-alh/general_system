import type {
  RegisterPayload,
  RegisterResponse,
  LoginResponse,
  LogoutResponse,
} from "../../../authorization/app/types/auth";

export function authenticationService() {
  const { $api } = useNuxtApp();
  async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await $api<RegisterResponse>("/register", {
      method: "POST",

      body: payload,
    });

    return response;
  }

  async function loginRequest(email: string, password: string) {
    return await $api<LoginResponse>("/login", {
      method: "POST",
      body: {
        email,
        password,
      },
    });
  }

  async function logoutRequest(token: string) {
    return await $api<LogoutResponse>("/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });
  }

  async function me() {
    return await $api("/me");
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

  // 2) Reset Password
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
    loginRequest,
    logoutRequest,
    me,
    forgetPassword,
    resetPassword,
  };
}
