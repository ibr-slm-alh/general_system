<script setup lang="ts">
import { authenticationService } from "~/services/auth/authentication.service";

const route = useRoute();
const { resetPassword } = authenticationService();

const token = ref(route.query.token as string);
const email = ref(route.query.email as string);

const password = ref("");
const password_confirmation = ref("");

const loading = ref(false);
const message = ref("");
const error = ref("");

const reset = async () => {
  try {
    loading.value = true;
    error.value = "";
    message.value = "";

    const response = await resetPassword({
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });

    message.value = response.message;

    await navigateTo("/authentication/login");
  } catch (err: any) {
    error.value = err?.data?.message || "Reset failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-20">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Reset Password</h1>
      </template>

      <div class="space-y-4">
        <UInput v-model="password" type="password" placeholder="New Password" />

        <UInput
          v-model="password_confirmation"
          type="password"
          placeholder="Confirm Password"
        />

        <UButton block :loading="loading" @click="reset">
          Reset Password
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
