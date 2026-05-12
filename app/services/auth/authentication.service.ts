import type { RegisterPayload, RegisterResponse } from "../../types/auth";

export function authenticationService() {
  const { $api } = useNuxtApp();
  async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    return await $fetch<RegisterResponse>(
      "http://localhost:8085/api/register",
      {
        method: "POST",

        body: payload,
      },
    );
  }
  return {
    register,
  };
}
