<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const mobileMenuOpen = ref(false);

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Docs",
    to: "/",
    active: route.path.startsWith("/docs/getting-started"),
  },
  {
    label: "Components",
    to: "/",
    active: route.path.startsWith("/docs/components"),
  },
  {
    label: "Figma",
    to: "/",
    target: "_blank",
  },
  {
    label: "Releases",
    to: "/",
    target: "_blank",
  },
]);

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  },
);
</script>

<template>
  <div class="flex flex-col">
    <!-- HEADER -->
    <UHeader class="relative" :ui="{ container: 'px-4!' }">
      <template #toggle>
        <UButton
          class="flex md:hidden"
          :icon="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          color="neutral"
          variant="ghost"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </template>

      <template #title>
        <span class="font-semibold">Nuxt UI</span>
      </template>

      <div class="hidden md:flex">
        <UNavigationMenu :items="items" />
      </div>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <!-- MOBILE DROPDOWN (FIXED HEIGHT ISSUE) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden absolute left-0 right-0 top-16 z-50 border-b border-default bg-primary-50 shadow-sm"
      >
        <nav class="flex flex-col px-4 py-2">
          <NuxtLink
            v-for="item in items"
            :key="item.label"
            :to="item.to"
            :target="item.target"
            class="flex items-center justify-between py-3 text-sm border-b border-default last:border-0 text-muted hover:text-default transition-colors"
            active-class="text-primary font-medium"
            @click="mobileMenuOpen = false"
          >
            <span>{{ item.label }}</span>

            <UIcon
              v-if="item.target === '_blank'"
              name="i-lucide-arrow-up-right"
              class="h-3.5 w-3.5 opacity-50"
            />
          </NuxtLink>
        </nav>
      </div>
    </Transition>

    <!-- CONTENT -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
