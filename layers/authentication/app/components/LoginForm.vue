<script setup lang="ts">
import { reactive } from "vue";

import { useAuth } from "../composables/useAuth";

import {
  loginSchema,
  type loginSchema as LoginSchema,
} from "../schemas/auth.schema";

const { login, loading, error } = useAuth();

const state = reactive<LoginSchema>({
  email: "",
  password: "",
});
const onSubmit = async () => {
  await login(state);
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
        @submit="onSubmit"
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
