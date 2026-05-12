<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { useRegister } from "~/composables/auth/useRegister";

import {
  registerSchema,
  type RegisterSchema,
} from "~/schemas/auth/register.schema";

const state = reactive<RegisterSchema>({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const { register, loading, error } = useRegister();

const toast = useToast();

const onSubmit = async (event: FormSubmitEvent<RegisterSchema>) => {
  // console.log(event.data);
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
  <UCard class="max-w-md mx-auto">
    <template #header>
      <h1 class="text-2xl font-bold">Register</h1>
    </template>

    <UForm
      :schema="registerSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField label="Name" name="name">
        <UInput v-model="state.name" placeholder="John Doe" />
      </UFormField>

      <UFormField label="Email" name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="john@example.com"
        />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormField>

      <UFormField label="Confirm Password" name="password_confirmation">
        <UInput v-model="state.password_confirmation" type="password" />
      </UFormField>

      <UButton type="submit" block :loading="loading"> Create Account </UButton>
    </UForm>
  </UCard>
</template>
