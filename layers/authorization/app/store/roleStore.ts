import { useAuthStore } from "#layers/authentication/app/stores/authStore";

export const roleStore = defineStore("role.store", () => {
  const authStore = useAuthStore();
  const roles = ref<any[]>([]);
  const permissions = ref<string[]>([]);

  function setRoles(allRoles: any[]) {
    roles.value = allRoles;
  }

  function removeRole(id: number) {
    roles.value = roles.value.filter((role: any) => role.id !== id);
  }

  function setPermissions(allPermissions: string[]) {
    permissions.value = allPermissions;
  }

  function hasPermission(permission: string) {
    return (
      authStore.user?.roles?.some((role: any) =>
        role.permissions?.some((p: any) => p.name === permission),
      ) ?? false
    );
  }

  return {
    roles,
    permissions,
    setRoles,
    removeRole,
    setPermissions,
    hasPermission,
  };
});
