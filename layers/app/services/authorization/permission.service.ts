import type { ApiResponse, Permission } from "~/types/roles";
import type { PermissionSchema } from "~/schemas/roles/role.schema";

export const permissionService = {
  async getAll(): Promise<ApiResponse<Permission[]>> {
    return await $fetch("/api/permissions");
  },

  async getOne(id: number): Promise<ApiResponse<Permission>> {
    return await $fetch(`/api/permissions/${id}`);
  },

  async create(data: PermissionSchema): Promise<ApiResponse<Permission>> {
    return await $fetch("/api/permissions", {
      method: "POST",
      body: data,
    });
  },

  async update(
    id: number,
    data: PermissionSchema,
  ): Promise<ApiResponse<Permission>> {
    return await $fetch(`/api/permissions/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    return await $fetch(`/api/permission/${id}`, {
      method: "DELETE",
    });
  },
};
