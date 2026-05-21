import { useAuthStore } from "../stores/authStore";
import { authenticationService } from "../services/authentication.service";

export function useAuth() {
  const store = useAuthStore();

  async function initAuth() {
    const token = useCookie<string | null>("auth_token");
    console.log("token", token);

    if (!token.value) {
      //   store.clearAuth();
      return;
    }

    try {
      const response = await authenticationService().me();

      store.setAuth(response.data);
    } catch (error) {
      console.log("ererererererereros", error);
      //   token.value = null;
      //   store.clearAuth();
    }
  }

  return {
    initAuth,
  };
}
