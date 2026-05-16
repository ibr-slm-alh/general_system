import { defineStore } from "pinia";
import type { Role, Permission } from "~/types/roles";
import { roleService } from "~/services/authorization/role.service";
import { permissionService } from "~/services/authorization/permission.service";
import type { RoleSchema, PermissionSchema } from "~/schemas/roles/role.schema";

export const useRoleStore = defineStore("roles", () => {
  const roles = ref<Role[]>([]);
  const permissions = ref<Permission[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ── Roles ──────────────────────────────────────────────────────────────
  async function fetchRoles() {
    loading.value = true;
    error.value = null;
    try {
      const res = await roleService.getAll();
      roles.value = res.data;
    } catch (e: any) {
      error.value = e?.data?.message ?? "Failed to fetch roles";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function createRole(data: RoleSchema) {
    const res = await roleService.create(data);
    roles.value.push(res.data);
    return res;
  }

  async function updateRole(id: number, data: RoleSchema) {
    const res = await roleService.update(id, data);
    const idx = roles.value.findIndex((r) => r.id === id);
    if (idx !== -1) roles.value[idx] = res.data;
    return res;
  }

  async function deleteRole(id: number) {
    await roleService.delete(id);
    roles.value = roles.value.filter((r) => r.id !== id);
  }

  async function syncRolePermissions(
    roleId: number,
    permissionNames: string[],
  ) {
    const res = await roleService.syncPermissions(roleId, {
      permissions: permissionNames,
    });
    const idx = roles.value.findIndex((r) => r.id === roleId);
    if (idx !== -1) roles.value[idx] = res.data;
    return res;
  }

  // ── Permissions ────────────────────────────────────────────────────────
  async function fetchPermissions() {
    const res = await permissionService.getAll();
    permissions.value = res.data;
    return res;
  }

  async function createPermission(data: PermissionSchema) {
    const res = await permissionService.create(data);
    permissions.value.push(res.data);
    return res;
  }

  async function updatePermission(id: number, data: PermissionSchema) {
    const res = await permissionService.update(id, data);
    const idx = permissions.value.findIndex((p) => p.id === id);
    if (idx !== -1) permissions.value[idx] = res.data;
    return res;
  }

  async function deletePermission(id: number) {
    await permissionService.delete(id);
    permissions.value = permissions.value.filter((p) => p.id !== id);
    // also remove from roles in memory
    roles.value = roles.value.map((r) => ({
      ...r,
      permissions: r.permissions.filter((p) => p.id !== id),
    }));
  }

  return {
    roles,
    permissions,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    syncRolePermissions,
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
  };
});
