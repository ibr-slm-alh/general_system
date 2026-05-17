<script setup lang="ts">
import RegisterForm from "#layers/authentication/app/components/RegisterForm.vue";

definePageMeta({
  layout: "auth",
});
</script>

<template>
  <!--
    mobile:  full viewport height, no padding (card is full-width edge-to-edge)
    sm+:     centered with padding, card floats in the middle
  -->
  <div class="flex flex-col items-center justify-center sm:p-4">
    <RegisterForm />
  </div>
</template>
