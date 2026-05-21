<script setup lang="ts">
import { h, resolveComponent, ref, onMounted } from "vue";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import { roleStore } from "../../store/roleStore";
import { useAuthStore } from "~~/layers/authentication/app/stores/authStore";

const store = roleStore();
// console.log("##########", store.hasPermission("roles:create"));
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UBadge = resolveComponent("UBadge");
const authStore = useAuthStore();
const { t } = useI18n();
const {
  getRoles,
  roles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  allPermissions,
  updateRolePermission,
} = useAuthorization();

/* ---------------- MODALS ---------------- */
const isCreateModalOpen = ref(false);
const isEditRoleModalOpen = ref(false);
const isEditPermissionsModalOpen = ref(false);
const isDeleteOpen = ref(false);
const loading = ref(false);

/* ---------------- STATE ---------------- */
const current_role = ref<any>({});
const permissions = ref<string[]>([]);
const selectedRoleId = ref<number | null>(null);

/* ---------------- AUTH STATE ---------------- */
const hasAccess = ref(false);

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
    console.log(
      "authStore permissions:",
      JSON.stringify(authStore.permissions),
    );
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
  loading.value = true;
  await createRole(newRole.value);

  newRole.value = {
    name: "",
    display_name: "",
  };

  loading.value = false;
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
  loading.value = true;
  await updateRole(
    {
      name: current_role.value.name,
      display_name: current_role.value.display_name,
    },
    current_role.value.id,
  );
  loading.value = false;
  isEditRoleModalOpen.value = false;
};

/* ---------------- UPDATE PERMISSIONS ---------------- */
const updatePermissions = async () => {
  if (!current_role.value.id) return;
  loading.value = true;
  await updateRolePermission(
    {
      permissions: permissions.value,
    },
    current_role.value.id,
  );
  loading.value = false;
  isEditPermissionsModalOpen.value = false;
};

/* ---------------- DELETE ---------------- */
const openDeleteModal = (id: number) => {
  selectedRoleId.value = id;
  isDeleteOpen.value = true;
};

const confirmDeleteAction = async () => {
  if (!selectedRoleId.value) return;
  loading.value = true;
  await deleteRole(selectedRoleId.value);
  loading.value = false;
  selectedRoleId.value = null;
  isDeleteOpen.value = false;
};

/* ---------------- TABLE ---------------- */
const columns: TableColumn<any>[] = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: t("role_name") },
  { accessorKey: "display_name", header: t("display_name") },
  {
    id: "permissions",
    header: t("permissions"),
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
            label: t("update_role"),
            icon: "lucide:settings",
            onSelect: () => openEditRoleModal(row.original),
          },
          {
            label: t("update_permissions"),
            icon: "lucide:shield",
            onSelect: () => openEditPermissionsModal(row.original),
          },
          {
            label: t("delete"),
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
        <h2 class="text-2xl font-bold">{{ t("roles_page") }}</h2>

        <UModal v-model:open="isCreateModalOpen" :title="t('create_role')">
          <UButton
            :label="t('create_role')"
            v-if="store.hasPermission('roles:create')"
            icon="lucide:plus"
          />

          <template #body>
            <div class="space-y-4">
              <UFormField :label="t('role_name')">
                <UInput v-model="newRole.name" class="w-full" />
              </UFormField>

              <UFormField :label="t('display_name')">
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
      <UModal v-model:open="isEditRoleModalOpen" :title="t('update_role')">
        <template #body>
          <div class="space-y-4">
            <UFormField :label="t('role_name')">
              <UInput v-model="current_role.name" class="w-full" />
            </UFormField>

            <UFormField :label="t('display_name')">
              <UInput v-model="current_role.display_name" class="w-full" />
            </UFormField>

            <UButton block :loading="loading" @click="updateRoleInfo">
              {{ t("update_role") }}
            </UButton>
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
            <UFormField :label="t('permissions')">
              <USelectMenu
                v-model="permissions"
                :items="allPermissions"
                multiple
                searchable
                class="w-full"
              />
            </UFormField>
            <UFormField label="Selected Permissions">
              <UInputTags v-model="permissions" class="w-full" />
            </UFormField>
            <UButton block :loading="loading" @click="updatePermissions">
              {{ t("update_permissions") }}
            </UButton>
          </div>
        </template>
      </UModal>

      <!-- DELETE -->
      <UModal v-model:open="isDeleteOpen" :title="t('delete_role')">
        <template #body>
          <p class="text-sm text-muted">
            {{ t("confirm_delete") }}
          </p>

          <div class="flex justify-end gap-2 mt-4">
            <UButton variant="soft" @click="isDeleteOpen = false">
              {{ t("cancel") }}
            </UButton>

            <UButton
              color="error"
              :loading="loading"
              @click="confirmDeleteAction"
            >
              {{ t("delete") }}
            </UButton>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
