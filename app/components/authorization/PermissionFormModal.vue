<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  permissionSchema,
  type PermissionSchema,
} from "../../../layers/authorization/app/schemas/roleSchema";
import type { Permission } from "~/types/roles";

const props = defineProps<{
  modelValue: boolean;
  editingPermission: Permission | null;
  state: PermissionSchema;
  loading: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [event: FormSubmitEvent<PermissionSchema>];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const title = computed(() =>
  props.editingPermission ? "Edit Permission" : "Create Permission",
);
</script>

<template>
  <UModal v-model:open="isOpen" :title="title">
    <template #body>
      <UForm
        :schema="permissionSchema"
        :state="state"
        class="space-y-4"
        @submit="emit('submit', $event)"
      >
        <UFormField label="Name" name="name" hint="Format: resource:action">
          <UInput
            v-model="state.name"
            placeholder="e.g. posts:edit"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Group" name="group">
          <UInput
            v-model="state.group"
            placeholder="e.g. posts"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-2 pt-2">
          <UButton color="neutral" variant="ghost" @click="isOpen = false">
            Cancel
          </UButton>
          <UButton type="submit" :loading="loading">
            {{ editingPermission ? "Update" : "Create" }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
