import { useRoleStore } from "~/stores/roles/roleStore";

export function useRoles() {
  const store = useRoleStore();
  const toast = useToast();

  const search = ref("");

  const filteredRoles = computed(() =>
    store.roles.filter(
      (r) =>
        r.name.toLowerCase().includes(search.value.toLowerCase()) ||
        r.display_name.toLowerCase().includes(search.value.toLowerCase()),
    ),
  );

  async function loadRoles() {
    try {
      await store.fetchRoles();
    } catch {
      toast.add({
        title: "Failed to load roles",
        color: "error",
      });
    }
  }

  async function removeRole(id: number) {
    try {
      await store.deleteRole(id);
      toast.add({ title: "Role deleted successfully", color: "success" });
    } catch (e: any) {
      toast.add({
        title: "Failed to delete role",
        description: e?.data?.message ?? "Something went wrong",
        color: "error",
      });
    }
  }

  return {
    roles: computed(() => store.roles),
    filteredRoles,
    loading: computed(() => store.loading),
    search,
    loadRoles,
    removeRole,
  };
}
