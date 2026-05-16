<script setup lang="ts">
import { useRoleStore } from "~/stores/roles/roleStore";
import type { Role, Permission } from "~/types/roles";

const props = defineProps<{
  modelValue: boolean;
  role: Role | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  saved: [];
}>();

const store = useRoleStore();
const toast = useToast();
const loading = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const selected = ref<string[]>([]);

watch(
  () => props.role,
  (role) => {
    if (role) {
      selected.value = role.permissions.map((p) => p.name);
    }
  },
  { immediate: true },
);

const groupedPermissions = computed(() => {
  const groups: Record<string, Permission[]> = {};
  for (const p of store.permissions) {
    if (!groups[p.group]) groups[p.group] = [];
    groups[p.group].push(p);
  }
  return groups;
});

function togglePermission(name: string) {
  const idx = selected.value.indexOf(name);
  if (idx === -1) selected.value.push(name);
  else selected.value.splice(idx, 1);
}

function toggleGroup(groupPermissions: Permission[]) {
  const names = groupPermissions.map((p) => p.name);
  const allSelected = names.every((n) => selected.value.includes(n));
  if (allSelected) {
    selected.value = selected.value.filter((n) => !names.includes(n));
  } else {
    for (const n of names) {
      if (!selected.value.includes(n)) selected.value.push(n);
    }
  }
}

function isGroupSelected(groupPermissions: Permission[]) {
  return groupPermissions.every((p) => selected.value.includes(p.name));
}

function isGroupIndeterminate(groupPermissions: Permission[]) {
  const count = groupPermissions.filter((p) =>
    selected.value.includes(p.name),
  ).length;
  return count > 0 && count < groupPermissions.length;
}

async function save() {
  if (!props.role) return;
  loading.value = true;
  try {
    await store.syncRolePermissions(props.role.id, selected.value);
    toast.add({ title: "Permissions updated successfully", color: "success" });
    emit("saved");
    isOpen.value = false;
  } catch (e: any) {
    toast.add({
      title: "Failed to update permissions",
      description: e?.data?.message ?? "Something went wrong",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="`Manage Permissions — ${role?.display_name ?? ''}`"
    :ui="{ width: 'sm:max-w-lg' }"
  >
    <template #body>
      <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div
          v-for="(perms, group) in groupedPermissions"
          :key="group"
          class="border border-(--ui-border) rounded-lg p-3"
        >
          <!-- Group header -->
          <div class="flex items-center gap-2 mb-2">
            <UCheckbox
              :model-value="isGroupSelected(perms)"
              :indeterminate="isGroupIndeterminate(perms)"
              @update:model-value="toggleGroup(perms)"
            />
            <span class="font-semibold capitalize text-sm">{{ group }}</span>
          </div>

          <!-- Individual permissions -->
          <div class="grid grid-cols-2 gap-1 pl-6">
            <UCheckbox
              v-for="perm in perms"
              :key="perm.id"
              :model-value="selected.includes(perm.name)"
              :label="perm.name"
              @update:model-value="togglePermission(perm.name)"
            />
          </div>
        </div>

        <p
          v-if="Object.keys(groupedPermissions).length === 0"
          class="text-sm text-(--ui-text-muted) text-center py-4"
        >
          No permissions available.
        </p>
      </div>

      <div
        class="flex justify-end gap-2 pt-4 border-t border-(--ui-border) mt-4"
      >
        <UButton color="neutral" variant="ghost" @click="isOpen = false">
          Cancel
        </UButton>
        <UButton :loading="loading" @click="save">Save Permissions</UButton>
      </div>
    </template>
  </UModal>
</template>
