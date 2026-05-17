import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  display_name: z.string().min(2, "Display name must be at least 2 characters"),
});

export type RoleSchema = z.infer<typeof roleSchema>;

export const permissionSchema = z.object({
  name: z
    .string()
    .regex(
      /^[a-z]+:[a-z]+$/,
      "Permission must follow resource:action format (e.g. posts:edit)",
    ),
  group: z.string().min(2, "Group must be at least 2 characters"),
});

export type PermissionSchema = z.infer<typeof permissionSchema>;

export const assignPermissionsSchema = z.object({
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export type AssignPermissionsSchema = z.infer<typeof assignPermissionsSchema>;
