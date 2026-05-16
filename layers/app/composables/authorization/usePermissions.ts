import type { FormSubmitEvent } from "@nuxt/ui";
import { useRoleStore } from "~/stores/roles/roleStore";
import { type PermissionSchema } from "~/schemas/roles/role.schema";
import type { Permission } from "~/types/roles";

export function usePermissions() {
  const store = useRoleStore();
  const toast = useToast();

  const isOpen = ref(false);
  const editingPermission = ref<Permission | null>(null);
  const formLoading = ref(false);

  const state = reactive<PermissionSchema>({
    name: "",
    group: "",
  });

  // grouped permissions for checkboxes
  const groupedPermissions = computed(() => {
    const groups: Record<string, Permission[]> = {};
    for (const p of store.permissions) {
      if (!groups[p.group]) groups[p.group] = [];
      groups[p.group].push(p);
    }
    return groups;
  });

  async function loadPermissions() {
    try {
      await store.fetchPermissions();
    } catch {
      toast.add({ title: "Failed to load permissions", color: "error" });
    }
  }

  function openCreate() {
    editingPermission.value = null;
    state.name = "";
    state.group = "";
    isOpen.value = true;
  }

  function openEdit(permission: Permission) {
    editingPermission.value = permission;
    state.name = permission.name;
    state.group = permission.group;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  async function onSubmit(event: FormSubmitEvent<PermissionSchema>) {
    formLoading.value = true;
    try {
      if (editingPermission.value) {
        await store.updatePermission(editingPermission.value.id, event.data);
        toast.add({
          title: "Permission updated successfully",
          color: "success",
        });
      } else {
        await store.createPermission(event.data);
        toast.add({
          title: "Permission created successfully",
          color: "success",
        });
      }
      close();
    } catch (e: any) {
      toast.add({
        title: "Failed to save permission",
        description: e?.data?.message ?? "Something went wrong",
        color: "error",
      });
    } finally {
      formLoading.value = false;
    }
  }

  async function removePermission(id: number) {
    try {
      await store.deletePermission(id);
      toast.add({ title: "Permission deleted successfully", color: "success" });
    } catch (e: any) {
      toast.add({
        title: "Failed to delete permission",
        description: e?.data?.message ?? "Something went wrong",
        color: "error",
      });
    }
  }

  return {
    permissions: computed(() => store.permissions),
    groupedPermissions,
    isOpen,
    editingPermission,
    formLoading,
    state,
    loadPermissions,
    openCreate,
    openEdit,
    close,
    onSubmit,
    removePermission,
  };
}
