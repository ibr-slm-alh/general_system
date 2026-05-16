<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useAuthStore } from "~/stores/auth/authStore";

// sidebar open state — starts closed on mobile, open on desktop
const open = ref(false);
const isMobile = ref(false);

onMounted(() => {
  const mq = window.matchMedia("(max-width: 767px)");
  isMobile.value = mq.matches;
  // on desktop open sidebar by default
  open.value = !mq.matches;

  mq.addEventListener("change", (e) => {
    isMobile.value = e.matches;
    if (!e.matches) open.value = true;
    else open.value = false;
  });
});

const authStore = useAuthStore();

const logout = async () => {
  await authStore.logoutRequest();
};

const items: NavigationMenuItem[] = [
  {
    label: "Home",
    icon: "i-lucide-house",
    active: true,
  },
  {
    label: "Inbox",
    icon: "i-lucide-inbox",
    badge: "4",
  },
  {
    label: "Register",
    to: "/authentication/register",
    icon: "i-lucide-users",
  },
  {
    label: "Logout",
    icon: "i-lucide-log-out",
    class: "text-red-400 rounded hover:bg-red-50 font-semibold",
    async onSelect() {
      logout();
    },
  },
];

// bottom nav items (mobile only) — subset of sidebar items
const bottomNavItems = [
  { label: "Home", icon: "i-lucide-house", to: "/" },
  { label: "Inbox", icon: "i-lucide-inbox", to: "/inbox", badge: "4" },
  { label: "Users", icon: "i-lucide-users", to: "/authentication/register" },
  { label: "Logout", icon: "i-lucide-log-out", action: logout },
];
</script>

<template>
  <div class="flex flex-col flex-1">
    <!-- ─── Top header ─────────────────────────────────────────── -->
    <UHeader :ui="{ container: 'px-4!' }">
      <template #toggle>
        <!-- only show sidebar toggle on md+ -->
        <UButton
          class="hidden md:flex"
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
      </template>

      <template #right>
        <!-- mobile: show hamburger that opens a drawer/sheet -->
        <UButton
          class="flex md:hidden"
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          aria-label="Open menu"
          @click="open = !open"
        />
      </template>
    </UHeader>

    <!-- ─── Body (sidebar + content) ─────────────────────────── -->
    <div class="flex flex-1 min-h-0">
      <!--
        Sidebar:
        - mobile:  slides in as an overlay drawer (collapsible="offcanvas" behaviour)
        - md+:     persistent collapsible sidebar
      -->
      <USidebar
        v-model:open="open"
        :collapsible="isMobile ? 'offcanvas' : 'icon'"
        :ui="{
          gap: 'h-[calc(100%-var(--ui-header-height))]',
          container:
            'absolute top-(--ui-header-height) bottom-0 h-[calc(100%-var(--ui-header-height))]',
        }"
      >
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
      </USidebar>

      <!-- ─── Page content ──────────────────────────────────── -->
      <!--
        mobile:  add bottom padding so content isn't hidden behind bottom nav
        md+:     normal padding
      -->
      <div class="flex-1 p-4 pb-20 md:pb-4 overflow-y-auto">
        <slot />
      </div>
    </div>

    <!-- ─── Bottom navigation (mobile only) ───────────────────── -->
    <!--
      Fixed to the bottom of the viewport on mobile.
      Hidden on md+ because the sidebar handles navigation there.
    -->
    <nav
      class="fixed bottom-0 inset-x-0 z-50 flex md:hidden h-16 bg-primary-50 border-t border-default safe-area-pb"
      aria-label="Mobile navigation"
    >
      <template v-for="item in bottomNavItems" :key="item.label">
        <!-- items with a route -->
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="relative flex flex-1 flex-col items-center justify-center gap-0.5 text-muted hover:text-default transition-colors"
          active-class="text-primary"
        >
          <span class="relative">
            <UIcon :name="item.icon" class="h-5 w-5" />
            <!-- badge -->
            <span
              v-if="item.badge"
              class="absolute -top-1 -right-2 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium leading-4 text-center"
            >
              {{ item.badge }}
            </span>
          </span>
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </NuxtLink>

        <!-- items with an action (logout) -->
        <button
          v-else-if="item.action"
          class="flex flex-1 flex-col items-center justify-center gap-0.5 text-red-400 hover:text-red-500 transition-colors"
          @click="item.action"
        >
          <UIcon :name="item.icon" class="h-5 w-5" />
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </button>
      </template>
    </nav>
  </div>
</template>
