<script setup lang="ts">
import { useRoles } from "../../composables/authorization/useRoles";
import { useRoleForm } from "~/composables/authorization/useRoleForm";
import { usePermissions } from "../../composables/authorization/usePermissions";
import type { Role } from "~/types/roles";

// ── Roles list ─────────────────────────────────────────────────────────
const { filteredRoles, loading, search, loadRoles, removeRole } = useRoles();

// ── Role create/edit form ──────────────────────────────────────────────
const roleForm = useRoleForm();

// ── Permissions CRUD ──────────────────────────────────────────────────
const permForm = usePermissions();

// ── Assign permissions modal ───────────────────────────────────────────
const assignModalOpen = ref(false);
const selectedRole = ref<Role | null>(null);

function openAssign(role: Role) {
  selectedRole.value = role;
  assignModalOpen.value = true;
}

// ── Delete confirmation ────────────────────────────────────────────────
const deleteModalOpen = ref(false);
const deleteTarget = ref<{
  type: "role" | "permission";
  id: number;
  label: string;
} | null>(null);
const deleteLoading = ref(false);

function confirmDeleteRole(role: Role) {
  deleteTarget.value = { type: "role", id: role.id, label: role.display_name };
  deleteModalOpen.value = true;
}

function confirmDeletePermission(id: number, name: string) {
  deleteTarget.value = { type: "permission", id, label: name };
  deleteModalOpen.value = true;
}

async function onDeleteConfirm() {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  try {
    if (deleteTarget.value.type === "role") {
      await removeRole(deleteTarget.value.id);
    } else {
      await permForm.removePermission(deleteTarget.value.id);
    }
    deleteModalOpen.value = false;
  } finally {
    deleteLoading.value = false;
  }
}

// ── Tabs ───────────────────────────────────────────────────────────────
const tabs = [
  { label: "Roles", icon: "i-lucide-shield", slot: "roles" },
  { label: "Permissions", icon: "i-lucide-key", slot: "permissions" },
];

// ── Init ───────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([loadRoles(), permForm.loadPermissions()]);
});
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Access Control</h1>
        <p class="text-(--ui-text-muted) text-sm mt-1">
          Manage roles and permissions
        </p>
      </div>
    </div>

    <UTabs :items="tabs">
      <!-- ═══════════════════════════════ ROLES TAB ═══════════════════════ -->
      <template #roles>
        <div class="space-y-4 mt-4">
          <!-- Toolbar -->
          <div class="flex items-center justify-between gap-4">
            <UInput
              v-model="search"
              icon="i-lucide-search"
              placeholder="Search roles..."
              class="max-w-xs"
            />
            <UButton icon="i-lucide-plus" @click="roleForm.openCreate()">
              Add Role
            </UButton>
          </div>

          <!-- Table -->
          <RolesRoleTable
            :roles="filteredRoles"
            :loading="loading"
            @edit="roleForm.openEdit($event)"
            @delete="confirmDeleteRole($event)"
            @manage-permissions="openAssign($event)"
          />
        </div>
      </template>

      <!-- ════════════════════════════ PERMISSIONS TAB ════════════════════ -->
      <template #permissions>
        <div class="space-y-4 mt-4">
          <div class="flex justify-end">
            <UButton icon="i-lucide-plus" @click="permForm.openCreate()">
              Add Permission
            </UButton>
          </div>

          <UTable
            :data="permForm.permissions.value"
            :columns="[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'group', label: 'Group', sortable: true },
              { key: 'actions', label: 'Actions' },
            ]"
          >
            <template #name-cell="{ row }">
              <UBadge color="primary" variant="soft">{{ row.name }}</UBadge>
            </template>

            <template #group-cell="{ row }">
              <UBadge color="neutral" variant="subtle" class="capitalize">
                {{ row.group }}
              </UBadge>
            </template>

            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <UButton
                  icon="i-lucide-pencil"
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  @click="permForm.openEdit(row)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  size="sm"
                  color="error"
                  variant="ghost"
                  @click="confirmDeletePermission(row.id, row.name)"
                />
              </div>
            </template>
          </UTable>
        </div>
      </template>
    </UTabs>

    <!-- ── Modals ─────────────────────────────────────────────────────── -->
    <RolesRoleFormModal
      v-model="roleForm.isOpen.value"
      :editing-role="roleForm.editingRole.value"
      :state="roleForm.state"
      :loading="roleForm.formLoading.value"
      @submit="roleForm.onSubmit($event)"
    />

    <RolesPermissionFormModal
      v-model="permForm.isOpen.value"
      :editing-permission="permForm.editingPermission.value"
      :state="permForm.state"
      :loading="permForm.formLoading.value"
      @submit="permForm.onSubmit($event)"
    />

    <RolesAssignPermissionsModal
      v-model="assignModalOpen"
      :role="selectedRole"
      @saved="loadRoles()"
    />

    <SharedDeleteConfirmModal
      v-model="deleteModalOpen"
      :title="`Delete ${deleteTarget?.type === 'role' ? 'Role' : 'Permission'}`"
      :description="`Are you sure you want to delete '${deleteTarget?.label}'? This cannot be undone.`"
      :loading="deleteLoading"
      @confirm="onDeleteConfirm()"
    />
  </div>
</template>
