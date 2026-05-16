import type { ApiResponse, Role } from "~/types/roles";
import type {
  RoleSchema,
  AssignPermissionsSchema,
} from "~/schemas/roles/role.schema";

export const roleService = {
  async getAll(): Promise<ApiResponse<Role[]>> {
    return await $fetch("http://localhost:8085/api/roles");
  },

  async getOne(id: number): Promise<ApiResponse<Role>> {
    return await $fetch(`/api/roles/${id}`);
  },

  async create(data: RoleSchema): Promise<ApiResponse<Role>> {
    return await $fetch("http://localhost:8085/api/roles", {
      method: "POST",
      body: data,
    });
  },

  async update(id: number, data: RoleSchema): Promise<ApiResponse<Role>> {
    return await $fetch(`http://localhost:8085/api/roles/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    return await $fetch(`http://localhost:8085/api/roles/${id}`, {
      method: "DELETE",
    });
  },

  async assignPermissions(
    roleId: number,
    data: AssignPermissionsSchema,
  ): Promise<ApiResponse<Role>> {
    return await $fetch(
      `http://localhost:8085/api/roles/${roleId}/permissions`,
      {
        method: "POST",
        body: data,
      },
    );
  },

  async syncPermissions(
    roleId: number,
    data: AssignPermissionsSchema,
  ): Promise<ApiResponse<Role>> {
    return await $fetch(
      `http://localhost:8085/api/roles/${roleId}/permissions`,
      {
        method: "PUT",
        body: data,
      },
    );
  },

  async removePermission(
    roleId: number,
    permissionId: number,
  ): Promise<ApiResponse<null>> {
    return await $fetch(
      `http://localhost:8085/api/roles/${roleId}/permissions/${permissionId}`,
      {
        method: "DELETE",
      },
    );
  },
};
