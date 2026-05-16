<script setup lang="ts">
import type { Role } from "~/types/roles";

const props = defineProps<{
  roles: Role[];
  loading: boolean;
}>();

const emit = defineEmits<{
  edit: [role: Role];
  delete: [role: Role];
  managePermissions: [role: Role];
}>();

const PREVIEW_COUNT = 3;

function previewPerms(role: Role) {
  return role.permissions.slice(0, PREVIEW_COUNT);
}

function extraCount(role: Role) {
  return Math.max(0, role.permissions.length - PREVIEW_COUNT);
}

const columns = [
  { key: "display_name", label: "Role", sortable: true },
  { key: "name", label: "Slug", sortable: true },
  { key: "permissions", label: "Permissions" },
  { key: "actions", label: "Actions" },
];

function getDropdownItems(role: Role) {
  return [
    [
      {
        label: "Edit",
        icon: "i-lucide-pencil",
        onSelect: () => emit("edit", role),
      },
      {
        label: "Manage Permissions",
        icon: "i-lucide-shield",
        onSelect: () => emit("managePermissions", role),
      },
    ],
    [
      {
        label: "Delete",
        icon: "i-lucide-trash-2",
        color: "error" as const,
        onSelect: () => emit("delete", role),
      },
    ],
  ];
}
</script>

<template>
  <UTable :data="roles" :columns="columns" :loading="loading">
    <!-- Role name with slug badge -->
    <template #display_name-cell="{ row }">
      <span class="font-medium">{{ row.display_name }}</span>
    </template>

    <!-- Slug column -->
    <template #name-cell="{ row }">
      <UBadge color="neutral" variant="subtle">{{ row.name }}</UBadge>
    </template>

    <!-- Permissions column: show first N tags + overflow count -->
    <template #permissions-cell="{ row }">
      <div class="flex flex-wrap gap-1 items-center">
        <template v-if="row.permissions.length === 0">
          <span class="text-(--ui-text-muted)">-</span>
        </template>
        <template v-else>
          <UBadge
            v-for="perm in previewPerms(row)"
            :key="perm.id"
            color="primary"
            variant="soft"
            size="sm"
          >
            {{ perm.name }}
          </UBadge>
          <UButton
            v-if="extraCount(row) > 0"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="emit('managePermissions', row)"
          >
            {{ extraCount(row) }} more
          </UButton>
        </template>
      </div>
    </template>

    <!-- Actions column -->
    <template #actions-cell="{ row }">
      <UDropdownMenu :items="getDropdownItems(row)">
        <UButton
          icon="i-lucide-ellipsis"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Actions"
        />
      </UDropdownMenu>
    </template>
  </UTable>
</template>
