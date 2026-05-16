<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { useRegister } from "~/composables/auth/useRegister";
import {
  registerSchema,
  type RegisterSchema,
} from "~/schemas/auth/auth.schema";

const state = reactive<RegisterSchema>({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const { register, loading, error } = useRegister();
const toast = useToast();

const onSubmit = async (event: FormSubmitEvent<RegisterSchema>) => {
  try {
    await register(event.data);
    toast.add({
      title: "Account created successfully",
      color: "success",
    });
    await navigateTo("/");
  } catch {
    toast.add({
      title: "Registration failed",
      description: error.value?.message || "Something went wrong",
      color: "error",
    });
  }
};
</script>

<template>
  <!-- mobile: full-width card, no side margins -->
  <!-- sm+: max-w-md centered -->
  <UCard class="w-full sm:max-w-md sm:mx-auto rounded-none sm:rounded-lg">
    <template #header>
      <!-- icon + title stacked, centered on mobile -->
      <div
        class="flex flex-col items-center gap-2 py-2 sm:flex-row sm:items-center sm:gap-3 sm:py-0"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
        >
          <UIcon name="i-lucide-user-plus" class="h-5 w-5 text-primary" />
        </div>
        <div class="text-center sm:text-left">
          <h1 class="text-xl font-bold leading-tight">Create account</h1>
          <p class="text-sm text-muted">Fill in your details below</p>
        </div>
      </div>
    </template>

    <UForm
      :schema="registerSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <!-- full width inputs on all sizes -->
      <UFormField label="Full name" name="name">
        <UInput
          v-model="state.name"
          placeholder="John Doe"
          icon="i-lucide-user"
          class="w-full"
          size="lg"
        />
      </UFormField>

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

      <UFormField label="Confirm password" name="password_confirmation">
        <UInput
          v-model="state.password_confirmation"
          type="password"
          icon="i-lucide-lock-keyhole"
          class="w-full"
          size="lg"
        />
      </UFormField>

      <!-- taller button for easy tap on mobile -->
      <UButton
        type="submit"
        block
        :loading="loading"
        size="lg"
        icon="i-lucide-arrow-right"
        trailing
        class="mt-2"
      >
        Create account
      </UButton>
    </UForm>

    <template #footer>
      <p class="text-center text-sm text-muted">
        Already have an account?
        <ULink to="/authentication/login" class="font-medium text-primary">
          Sign in
        </ULink>
      </p>
    </template>
  </UCard>
</template>
