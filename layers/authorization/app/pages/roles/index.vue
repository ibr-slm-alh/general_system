<script setup lang="ts">
import { h, resolveComponent, ref, onMounted } from "vue";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UBadge = resolveComponent("UBadge");
const {
  getRoles,
  roles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  allPermissions,
  updateRolePermission,
  loading,
} = useAuthorization();

/* ---------------- MODALS ---------------- */
const isCreateModalOpen = ref(false);
const isEditRoleModalOpen = ref(false);
const isEditPermissionsModalOpen = ref(false);
const isDeleteOpen = ref(false);

/* ---------------- STATE ---------------- */
const current_role = ref<any>({});
const permissions = ref<string[]>([]);
const selectedRoleId = ref<number | null>(null);

/* ---------------- AUTH STATE ---------------- */
const hasAccess = ref(true);
const alertMessage = ref("");

/* ---------------- CREATE ROLE ---------------- */
const newRole = ref<createRolePayload>({
  name: "",
  display_name: "",
});

/* ---------------- INIT ---------------- */
onMounted(async () => {
  try {
    await Promise.all([getRoles(), getPermissions()]);
    hasAccess.value = true;
  } catch (err: any) {
    const status = err?.response?.status || err?.status;

    if (status === 403) {
      hasAccess.value = false;
      alertMessage.value =
        "You do not have permission to view Roles & Permissions.";
    } else {
      alertMessage.value = "Failed to load data.";
    }
  }
});

/* ---------------- CREATE ---------------- */
const create = async () => {
  await createRole(newRole.value);

  newRole.value = {
    name: "",
    display_name: "",
  };

  isCreateModalOpen.value = false;
};

/* ---------------- OPEN EDIT ROLE ---------------- */
const openEditRoleModal = (role: any) => {
  current_role.value = { ...role };
  isEditRoleModalOpen.value = true;
};

/* ---------------- OPEN EDIT PERMISSIONS ---------------- */
const openEditPermissionsModal = (role: any) => {
  current_role.value = { ...role };
  permissions.value = role.permissions?.map((p: any) => p.name) || [];
  isEditPermissionsModalOpen.value = true;
};

/* ---------------- UPDATE ROLE INFO ---------------- */
const updateRoleInfo = async () => {
  if (!current_role.value.id) return;

  await updateRole(
    {
      name: current_role.value.name,
      display_name: current_role.value.display_name,
    },
    current_role.value.id,
  );

  isEditRoleModalOpen.value = false;
};

/* ---------------- UPDATE PERMISSIONS ---------------- */
const updatePermissions = async () => {
  if (!current_role.value.id) return;

  await updateRolePermission(
    {
      permissions: permissions.value,
    },
    current_role.value.id,
  );

  isEditPermissionsModalOpen.value = false;
};

/* ---------------- DELETE ---------------- */
const openDeleteModal = (id: number) => {
  selectedRoleId.value = id;
  isDeleteOpen.value = true;
};

const confirmDeleteAction = async () => {
  if (!selectedRoleId.value) return;

  await deleteRole(selectedRoleId.value);

  selectedRoleId.value = null;
  isDeleteOpen.value = false;
};

/* ---------------- TABLE ---------------- */
const columns: TableColumn<any>[] = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: "Role Name" },
  { accessorKey: "display_name", header: "Display Name" },
  {
    id: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const perms = row.original.permissions || [];
      const visible = perms.slice(0, 3);
      const remaining = perms.length - visible.length;

      return h("div", { class: "flex gap-1 flex-wrap" }, [
        ...visible.map((p: any) =>
          h(UBadge, { color: "neutral", variant: "outline" }, () => p.name),
        ),
        remaining > 0
          ? h("span", { class: "text-xs text-muted" }, `+${remaining}`)
          : null,
      ]);
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const items: DropdownMenuItem[][] = [
        [
          {
            label: "Edit Role",
            icon: "lucide:settings",
            onSelect: () => openEditRoleModal(row.original),
          },
          {
            label: "Edit Permissions",
            icon: "lucide:shield",
            onSelect: () => openEditPermissionsModal(row.original),
          },
          {
            label: "Delete",
            icon: "lucide:trash",
            color: "error",
            onSelect: () => openDeleteModal(row.original.id),
          },
        ],
      ];

      return h(UDropdownMenu, { items, content: { align: "end" } }, () =>
        h(UButton, {
          icon: "i-lucide-ellipsis-vertical",
          color: "neutral",
          variant: "ghost",
        }),
      );
    },
  },
];
</script>

<template>
  <div>
    <!-- ALERT 403 -->
    <UAlert
      v-if="alertMessage"
      color="error"
      variant="soft"
      icon="i-lucide-shield-alert"
      :description="alertMessage"
      class="mb-4"
    />

    <!-- CONTENT ONLY IF ACCESS -->
    <div v-if="hasAccess">
      <!-- HEADER -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold">Roles Page</h2>

        <UModal v-model:open="isCreateModalOpen" title="Create Role">
          <UButton label="Create Role" icon="lucide:plus" />

          <template #body>
            <div class="space-y-4">
              <UFormField label="Role Name">
                <UInput v-model="newRole.name" class="w-full" />
              </UFormField>

              <UFormField label="Display Name">
                <UInput v-model="newRole.display_name" class="w-full" />
              </UFormField>

              <UButton block :loading="loading" @click="create">
                Create
              </UButton>
            </div>
          </template>
        </UModal>
      </div>

      <!-- TABLE -->
      <UCard variant="subtle">
        <UTable :data="roles" :columns="columns" />
      </UCard>

      <!-- EDIT ROLE -->
      <UModal v-model:open="isEditRoleModalOpen" title="Edit Role">
        <template #body>
          <div class="space-y-4">
            <UFormField label="Role Name">
              <UInput v-model="current_role.name" class="w-full" />
            </UFormField>

            <UFormField label="Display Name">
              <UInput v-model="current_role.display_name" class="w-full" />
            </UFormField>

            <UButton block @click="updateRoleInfo"> Update Role </UButton>
          </div>
        </template>
      </UModal>

      <!-- EDIT PERMISSIONS -->
      <UModal
        v-model:open="isEditPermissionsModalOpen"
        title="Edit Permissions"
      >
        <template #body>
          <div class="space-y-4">
            <UFormField label="Permissions">
              <USelectMenu
                v-model="permissions"
                :items="allPermissions"
                multiple
                searchable
                class="w-full"
              />
            </UFormField>

            <UButton block @click="updatePermissions">
              Update Permissions
            </UButton>
          </div>
        </template>
      </UModal>

      <!-- DELETE -->
      <UModal v-model:open="isDeleteOpen" title="Delete Role">
        <template #body>
          <p class="text-sm text-muted">
            Are you sure you want to delete this role?
          </p>

          <div class="flex justify-end gap-2 mt-4">
            <UButton variant="soft" @click="isDeleteOpen = false">
              Cancel
            </UButton>

            <UButton color="error" @click="confirmDeleteAction">
              Delete
            </UButton>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
