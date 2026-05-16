import type { FormSubmitEvent } from "@nuxt/ui";
import { useRoleStore } from "~/stores/roles/roleStore";
import { type RoleSchema } from "~/schemas/roles/role.schema";
import type { Role } from "~/types/roles";

export function useRoleForm() {
  const store = useRoleStore();
  const toast = useToast();

  const isOpen = ref(false);
  const editingRole = ref<Role | null>(null);
  const formLoading = ref(false);

  const state = reactive<RoleSchema>({
    name: "",
    display_name: "",
  });

  function openCreate() {
    editingRole.value = null;
    state.name = "";
    state.display_name = "";
    isOpen.value = true;
  }

  function openEdit(role: Role) {
    editingRole.value = role;
    state.name = role.name;
    state.display_name = role.display_name;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  async function onSubmit(event: FormSubmitEvent<RoleSchema>) {
    formLoading.value = true;
    try {
      if (editingRole.value) {
        await store.updateRole(editingRole.value.id, event.data);
        toast.add({ title: "Role updated successfully", color: "success" });
      } else {
        await store.createRole(event.data);
        toast.add({ title: "Role created successfully", color: "success" });
      }
      close();
    } catch (e: any) {
      toast.add({
        title: editingRole.value
          ? "Failed to update role"
          : "Failed to create role",
        description: e?.data?.message ?? "Something went wrong",
        color: "error",
      });
    } finally {
      formLoading.value = false;
    }
  }

  return {
    isOpen,
    editingRole,
    formLoading,
    state,
    openCreate,
    openEdit,
    close,
    onSubmit,
  };
}
