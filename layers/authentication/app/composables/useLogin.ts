import { authenticationService } from "~~/layers/authentication/app/services/authentication.service";
import { loginSchema } from "~~/layers/authentication/app/schemas/auth.schema";
import { useAuthStore } from "~~/layers/authentication/app/stores/authStore";

export const useLogin = () => {
  const authStore = useAuthStore();

  const form = reactive({
    email: "",
    password: "",
  });

  const loading = ref(false);
  const error = ref("");

  const { loginRequest } = authenticationService();

  const login = async () => {
    try {
      loading.value = true;
      error.value = "";

      loginSchema.parse(form);

      const response = await loginRequest(form.email, form.password);

      authStore.setAuth({
        user: response.data.user,
        permissions: response.data.permissions,
        access_token: response.data.token.access_token,
      });

      await navigateTo("/");
    } catch (err: any) {
      error.value =
        err?.errors?.[0]?.message || err?.data?.message || "Login failed";
    } finally {
      loading.value = false;
    }
  };

  return {
    form,
    loading,
    error,
    login,
  };
};
