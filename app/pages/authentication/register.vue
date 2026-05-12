<script setup lang="ts">
import RegisterForm from "~/components/auth/RegisterForm.vue";

definePageMeta({
  layout: "auth",
});
</script>
<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <RegisterForm />
  </div>
</template>
