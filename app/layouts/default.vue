<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
// import { useAuth } from "~/composable/useAuth";

const open = ref(true);
// const { user, clear: clearSession } = useUserSession();
// const { logout } = useAuth();

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
  //   {
  //     label: "Roels",
  //     to: "/authorization/roles",
  //     icon: "i-lucide-users",
  //   },
  //   {
  //     label: "about",
  //     to: "/about",
  //     icon: "i-lucide-users",
  //   },
  //   {
  //     label: "Logout",
  //     icon: "i-lucide-log-out",
  //     class: "text-red-400 rounded hover:bg-red-50 font-semibold",
  //     async onSelect() {
  //       logout();
  //     },
  //   },
];
</script>

<template>
  <div class="flex flex-col flex-1">
    <UHeader toggle-side="left" :ui="{ container: 'px-4!' }">
      <template #toggle>
        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
      </template>
    </UHeader>

    <div class="flex flex-1 min-h-0">
      <USidebar
        v-model:open="open"
        collapsible="icon"
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
        <!-- <UButton
                    icon="i-lucide-log-out"
                    class="justify-center"
                    @click="logout"
                >
                    Logout
                </UButton> -->
      </USidebar>

      <div class="flex-1 p-4">
        <slot />
      </div>
    </div>
  </div>
</template>
