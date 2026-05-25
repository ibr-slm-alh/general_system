import type { RegisterPayload } from "~~/layers/authorization/app/types/auth";
import { authenticationService } from "~~/layers/authentication/app/services/authentication.service";
import { useAuthStore } from "~~/layers/authentication/app/stores/authStore";

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

      if (!response?.success) {
        throw response;
      }

      authStore.setAuth({
        user: response.data.user,
        permissions: response.data.permissions,
        access_token: response.data.token?.access_token ?? null,
      });

      return response;
    } catch (err: any) {
      const normalizedError = err?.data || err?.response?._data || err;
      error.value = normalizedError;
      throw normalizedError;
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
