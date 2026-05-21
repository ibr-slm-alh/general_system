<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { useRegister } from "~~/layers/authentication/app/composables/useRegister";
import {
  registerSchema,
  type RegisterSchema,
} from "#layers/authentication/app/schemas/auth.schema";

definePageMeta({
  layout: "auth",
});

const state = reactive<RegisterSchema>({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const { register, loading } = useRegister();

/**
 * 📢 Alert message (UI error display)
 */
const alertMessage = ref("");

/**
 * 🌐 Internet status
 */
const isOnline = ref(true);

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;

  if (isOnline.value) {
    alertMessage.value = "";
  }
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

/**
 * 🚀 Submit handler
 */
const onSubmit = async (event: FormSubmitEvent<RegisterSchema>) => {
  try {
    alertMessage.value = "";

    // ❌ No internet
    if (!isOnline.value) {
      alertMessage.value = "No internet connection. Please check your network.";
      return;
    }

    await register(event.data);

    await navigateTo("/");
  } catch (err: any) {
    const data = err?.data || err?.response?._data || err;
    const errors = data?.errors || {};

    // 📧 Email already exists (422)
    if (errors?.email?.[0]) {
      alertMessage.value = errors.email[0];
      return;
    }

    // 🧾 First validation error fallback
    const firstError = Object.values(errors)?.[0]?.[0];
    if (firstError) {
      alertMessage.value = firstError;
      return;
    }

    // ⚠️ General error
    alertMessage.value = data?.message || "Something went wrong";
  }
};
</script>

<template>
  <UCard class="w-full sm:max-w-md sm:mx-auto rounded-none sm:rounded-lg">
    <template #header>
      <div class="text-center sm:text-left">
        <h1 class="text-xl font-bold">Create account</h1>
        <p class="text-sm text-muted">Fill in your details below</p>
      </div>
    </template>

    <UForm
      :schema="registerSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField label="Full name" name="name">
        <UInput v-model="state.name" class="w-full" size="lg" />
      </UFormField>

      <UFormField label="Email" name="email">
        <UInput v-model="state.email" type="email" class="w-full" size="lg" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          class="w-full"
          size="lg"
        />
      </UFormField>

      <UFormField label="Confirm password" name="password_confirmation">
        <UInput
          v-model="state.password_confirmation"
          type="password"
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
      >
        Create account
      </UButton>

      <!-- 🚨 Alert -->
      <UAlert
        v-if="alertMessage"
        color="error"
        variant="soft"
        icon="i-lucide-alert-circle"
        :description="alertMessage"
      />
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
