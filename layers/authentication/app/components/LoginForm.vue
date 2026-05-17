<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "#layers/authentication/app/stores/authStore";
import { authenticationService } from "#layers/authentication/app/services/authentication.service";
import {
  loginSchema,
  type loginSchema as LoginSchema,
} from "#layers/authentication/app/schemas/auth.schema";

definePageMeta({
  layout: "auth",
});

const state = reactive<LoginSchema>({
  email: "",
  password: "",
});

const { loginRequest } = authenticationService();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref("");

const isOnline = ref(true);

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

onMounted(() => {
  isOnline.value = navigator.onLine;
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener("online", updateOnlineStatus);
  window.removeEventListener("offline", updateOnlineStatus);
});

const login = async () => {
  try {
    loading.value = true;
    error.value = "";

    if (!isOnline.value) {
      error.value = "No internet connection. Please check your network.";
      return;
    }

    loginSchema.parse(state);

    const response = await loginRequest(state.email, state.password);

    authStore.setAuth({
      user: response.data.user,
      permissions: response.data.permissions,
      access_token: response.data.token.access_token,
    });

    // redirect
    await navigateTo("/");
  } catch (err: any) {
    console.log(err);

    error.value =
      err?.data?.message ||
      err?.response?._data?.message ||
      err?.message ||
      "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center sm:p-4">
    <UCard class="w-full sm:max-w-md sm:mx-auto rounded-none sm:rounded-lg">
      <template #header>
        <div
          class="flex flex-col items-center gap-2 py-2 sm:flex-row sm:items-center sm:gap-3 sm:py-0"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
          >
            <UIcon name="i-lucide-lock" class="h-5 w-5 text-primary" />
          </div>

          <div class="text-center sm:text-left">
            <h1 class="text-xl font-bold leading-tight">Welcome back</h1>

            <p class="text-sm text-muted">Sign in to your account</p>
          </div>
        </div>
      </template>

      <UForm
        :schema="loginSchema"
        :state="state"
        class="space-y-4"
        @submit="login"
      >
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="john@example.com"
            icon="i-lucide-mail"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            icon="i-lucide-lock"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="loading"
          size="lg"
          icon="i-lucide-arrow-right"
          trailing
          class="mt-2"
        >
          Sign in
        </UButton>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          icon="i-lucide-alert-circle"
          :description="error"
        />
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-muted">
          Don't have an account?

          <ULink to="/authentication/register" class="font-medium text-primary">
            Register
          </ULink>
        </p>
      </template>
    </UCard>
  </div>
</template>
