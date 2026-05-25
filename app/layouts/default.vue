<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import * as locales from "@nuxt/ui/locale";

const { t, locale, setLocale } = useI18n();
const { logout } = useAuth();

// ─── RTL detection ────────────────────────────────────────────
const isRTL = computed(() => locale.value === "ar");

watch(
  isRTL,
  (rtl) => {
    if (import.meta.client) {
      document.documentElement.dir = rtl ? "rtl" : "ltr";
      document.documentElement.lang = locale.value;
    }
  },
  { immediate: true },
);

// ─── Sidebar state ────────────────────────────────────────────
const open = ref(false);
const isMobile = ref(false);

onMounted(() => {
  const mq = window.matchMedia("(max-width: 767px)");

  isMobile.value = mq.matches;
  open.value = !mq.matches;

  mq.addEventListener("change", (e) => {
    isMobile.value = e.matches;
    open.value = !e.matches;
  });
});

// ─── Navigation items ─────────────────────────────────────────
const items: NavigationMenuItem[] = [
  {
    label: t("home"),
    to: "/",
    icon: "i-lucide-house",
  },
  {
    label: "Profile",
    icon: "lucide:circle-user-round",
    badge: "4",
  },
  {
    label: t("roles"),
    to: "/roles",
    icon: "carbon-user-role",
  },
  {
    label: t("logout"),
    icon: "i-lucide-log-out",
    class: "text-red-400 rounded hover:bg-red-50 font-semibold",
    async onSelect() {
      await logout();
    },
  },
];

// ─── Bottom navigation ────────────────────────────────────────
const bottomNavItems = [
  { label: t("Home"), icon: "i-lucide-house", to: "/" },
  { label: t("Inbox"), icon: "i-lucide-inbox", to: "/inbox", badge: "4" },
  { label: t("Users"), icon: "i-lucide-users", to: "/authentication/register" },
  {
    label: t("Logout"),
    icon: "i-lucide-log-out",
    action: async () => {
      await logout();
    },
  },
];

// ─── Sidebar side (RTL/LTR) ───────────────────────────────────
const sidebarSide = computed(() => (isRTL.value ? "right" : "left"));
</script>

<template>
  <div class="flex flex-col flex-1" :dir="isRTL ? 'rtl' : 'ltr'">
    <!-- ─── Header ───────────────────────────────────────────── -->
    <UHeader :ui="{ container: 'px-4!' }">
      <!-- Language toggle -->
      <UButton
        :label="locale == 'en' ? 'العربية' : 'English'"
        @click="setLocale(locale == 'en' ? 'ar' : 'en')"
      />

      <!-- Sidebar toggle -->
      <template #toggle>
        <UButton
          class="hidden md:flex"
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          :class="{ 'scale-x-[-1]': isRTL }"
          @click="open = !open"
        />
      </template>

      <!-- Mobile menu -->
      <template #right>
        <UButton
          class="flex md:hidden"
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          @click="open = !open"
        />
      </template>
    </UHeader>

    <!-- ─── Body ─────────────────────────────────────────────── -->
    <div class="flex flex-1 min-h-0">
      <USidebar
        v-model:open="open"
        :side="sidebarSide"
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

      <!-- Page content -->
      <div class="flex-1 p-4 pb-20 md:pb-4 overflow-y-auto">
        <slot />
      </div>
    </div>

    <!-- ─── Bottom nav ───────────────────────────────────────── -->
    <nav
      class="fixed bottom-0 inset-x-0 z-50 flex md:hidden h-16 bg-primary-50 border-t border-default safe-area-pb"
    >
      <template v-for="item in bottomNavItems" :key="item.label">
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="flex flex-1 flex-col items-center justify-center gap-0.5 text-muted hover:text-default"
          active-class="text-primary"
        >
          <span class="relative">
            <UIcon :name="item.icon" class="h-5 w-5" />
            <span
              v-if="item.badge"
              class="absolute -top-1 -end-2 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px]"
            >
              {{ item.badge }}
            </span>
          </span>
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </NuxtLink>

        <button
          v-else-if="item.action"
          class="flex flex-1 flex-col items-center justify-center gap-0.5 text-red-400"
          @click="item.action"
        >
          <UIcon :name="item.icon" class="h-5 w-5" />
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </button>
      </template>
    </nav>
  </div>
</template>
