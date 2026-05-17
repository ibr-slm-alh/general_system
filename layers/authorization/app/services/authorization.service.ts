import type { Role } from "../types/auth";

export function useAuthorizationService() {
  const { $api } = useNuxtApp();

  async function fetchRoles() {
    return await $api("/roles", { method: "GET" });
  }

  async function createRole(payload: { name: string }) {
    return await $api("/roles", {
      method: "POST",
      body: payload,
    });
  }

  async function updateRole(payload: Partial<Role>, id: number) {
    return await $api(`/roles/${id}`, {
      method: "PATCH",
      body: payload,
    });
  }
  async function deleteRole(id: number) {
    return await $api(`/roles/${id}`, {
      method: "DELETE",
    });
  }
  async function fetchPermissions() {
    return await $api("/permissions", {
      method: "GET",
    });
  }
  async function updateRolePermission(payload: any, id: number) {
    return await $api(`/roles/${id}/permissions`, {
      method: "POST",
      body: payload,
    });
  }

  return {
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    fetchPermissions,
    updateRolePermission,
  };
}
