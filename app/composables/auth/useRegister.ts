import type { RegisterPayload } from "~/types/auth";
import { authenticationService } from "~/services/auth/authentication.service";
import { useAuthStore } from "~/stores/auth/authStore";

export const useRegister = () => {
  const authStore = useAuthStore();

  const loading = ref(false);

  const error = ref<any>(null);

  const authService = authenticationService();
  const register = async (payload: RegisterPayload) => {
    try {
      loading.value = true;

      error.value = null;

      const response = await authService.register(payload);

      authStore.setAuth({
        user: response.data.user,
        permissions: response.data.permissions,
        access_token: response.data.token.access_token,
      });
      return response;
    } catch (err: any) {
      error.value = err?.data || err;

      throw err;
    } finally {
      loading.value = false;
    }
  };
  return {
    register,
    loading,
    error,
  };
};
