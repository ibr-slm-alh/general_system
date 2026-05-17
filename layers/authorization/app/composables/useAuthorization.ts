import { useAuthorizationService } from "../services/authorization.service";
import { roleStore } from "../store/roleStore";
import type { createRolePayload, Role } from "../types/auth";

export function useAuthorization() {
  const store = roleStore();
  const toast = useToast();

  async function getRoles() {
    const response = await useAuthorizationService().fetchRoles();
    store.setRoles(response.data);
  }

  async function createRole(payload: createRolePayload) {
    const response = await useAuthorizationService().createRole(payload);

    store.setRoles([...(store.roles ?? []), response.data]);
  }

  async function updateRole(payload: Partial<Role>, id: number) {
    const response = await useAuthorizationService().updateRole(payload, id);

    store.setRoles(
      (store.roles ?? []).map((role) =>
        role.id === id ? response.data : role,
      ),
    );
  }

  async function updateRolePermission(payload: Partial<Role>, id: number) {
    const response = await useAuthorizationService().updateRolePermission(
      payload,
      id,
    );
    toast.add({
      title: "Success",
      description: "Your action was completed successfully.",
      color: "success",
    });
    store.setRoles(
      (store.roles ?? []).map((role) =>
        role.id === id ? { ...role, ...response.data } : role,
      ),
    );
  }

  async function deleteRole(id: number) {
    await useAuthorizationService().deleteRole(id);

    store.setRoles((store.roles ?? []).filter((role) => role.id !== id));
  }

  const allPermissions = ref<string[]>([]);
  const permissions = ref<string[]>([]);

  async function getPermissions() {
    const res = await useAuthorizationService().fetchPermissions();

    allPermissions.value = res.data.map((p: any) => p.name);
  }
  return {
    // state
    roles: computed(() => store.roles),

    // actions
    getRoles,
    createRole,
    updateRole,
    updateRolePermission,
    deleteRole,
    getPermissions,
    allPermissions,
    permissions,
  };
}
