<script setup lang="ts">
import * as locales from "@nuxt/ui/locale";

const { locale } = useI18n();

const dir = computed(() => locales[locale.value].dir); // 'rtl' أو 'ltr'

useHead({
  htmlAttrs: {
    lang: computed(() => locales[locale.value].code),
    dir, // ← هاد هو اللي يحول الصفحة كاملة RTL
  },
});
const toaster = { position: "top-center" };

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: locale.value,
  },
});

const title = "Nuxt Starter Template";
const description =
  "A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtLayout>
      <UButton @click="ws.send(`asdf`)">SEND TO SOCKET</UButton>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
