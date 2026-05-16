<script setup lang="ts">
import { authenticationService } from "~/services/auth/authentication.service";

const { forgetPassword } = authenticationService();

const email = ref("");
const loading = ref(false);
const message = ref("");
const error = ref("");

const sendResetLink = async () => {
  try {
    loading.value = true;
    error.value = "";
    message.value = "";

    const response = await forgetPassword(email.value);

    message.value = response.message;
  } catch (err: any) {
    error.value = err?.data?.message || "Something went wrong";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-20">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Forgot Password</h1>
      </template>

      <div class="space-y-4">
        <UInput v-model="email" placeholder="Email" />

        <UButton block :loading="loading" @click="sendResetLink">
          Send Reset Link
        </UButton>

        <p v-if="message" class="text-green-500 text-sm">
          {{ message }}
        </p>

        <p v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </p>
      </div>
    </UCard>
  </div>
</template>
