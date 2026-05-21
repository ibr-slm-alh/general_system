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

      authStore.setAuth({
        user: response.data.user,
        permissions: response.data.permissions,
        access_token: response.data.token.access_token,
      });

      return response;
    } catch (err: any) {
      console.log("REGISTER COMPOSABLE ERROR:", err);

      // 🔥 أهم إصلاح: توحيد شكل الخطأ
      const normalizedError = err?.data || err?.response?._data || err;

      error.value = normalizedError;

      throw normalizedError; // مهم جداً للصفحة
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
