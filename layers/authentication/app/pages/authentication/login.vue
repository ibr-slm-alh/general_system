<script setup lang="ts">
import LoginForm from "#layers/authentication/app/components/LoginForm.vue";

definePageMeta({
  layout: "auth",
});
</script>

<template>
  <!--
    mobile:  full viewport height, no padding (card is full-width edge-to-edge)
    sm+:     centered with padding, card floats in the middle
  -->
  <div>
    <LoginForm />
  </div>
</template>
