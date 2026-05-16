<script setup lang="ts">
import { useAuthStore } from "~/stores/auth/authStore";
import { authenticationService } from "~/services/auth/authentication.service";
import { loginSchema } from "../../schemas/auth/auth.schema";

definePageMeta({
  layout: "auth",
});

const { loginRequest } = authenticationService();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const login = async () => {
  try {
    loading.value = true;
    error.value = "";

    loginSchema.parse({
      email: email.value,
      password: password.value,
    });

    const response = await loginRequest(email.value, password.value);

    authStore.setAuth({
      user: response.data.user,
      permissions: response.data.permissions,
      access_token: response.data.token.access_token,
    });

    navigateTo("/");
  } catch (err: any) {
    error.value =
      err?.errors?.[0]?.message || err?.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <!--
    mobile:  full viewport height, card edge-to-edge (no side padding)
    sm+:     centered, card floats with max-w-md
  -->
  <div class="flex flex-col items-center justify-center sm:p-4">
    <UCard class="w-full sm:max-w-md sm:mx-auto rounded-none sm:rounded-lg">
      <template #header>
        <!-- centered icon + title on mobile, left-aligned on sm+ -->
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

      <div class="space-y-4">
        <UFormField label="Email" name="email">
          <UInput
            v-model="email"
            type="email"
            placeholder="john@example.com"
            icon="i-lucide-mail"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="password"
            type="password"
            icon="i-lucide-lock"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <!-- taller button for easy tap on mobile -->
        <UButton
          block
          :loading="loading"
          size="lg"
          icon="i-lucide-arrow-right"
          trailing
          class="mt-2"
          @click="login"
        >
          Sign in
        </UButton>

        <!-- inline error banner -->
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          icon="i-lucide-alert-circle"
          :description="error"
        />
      </div>

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
