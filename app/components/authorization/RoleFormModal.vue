<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { roleSchema, type RoleSchema } from "~/schemas/roles/role.schema";
import type { Role } from "~/types/roles";

const props = defineProps<{
  modelValue: boolean;
  editingRole: Role | null;
  state: RoleSchema;
  loading: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [event: FormSubmitEvent<RoleSchema>];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const title = computed(() => (props.editingRole ? "Edit Role" : "Create Role"));
</script>

<template>
  <UModal v-model:open="isOpen" :title="title">
    <template #body>
      <UForm
        :schema="roleSchema"
        :state="state"
        class="space-y-4"
        @submit="emit('submit', $event)"
      >
        <UFormField label="Name" name="name">
          <UInput
            v-model="state.name"
            placeholder="e.g. editor"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Display Name" name="display_name">
          <UInput
            v-model="state.display_name"
            placeholder="e.g. Editor"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-2 pt-2">
          <UButton color="neutral" variant="ghost" @click="isOpen = false">
            Cancel
          </UButton>
          <UButton type="submit" :loading="loading">
            {{ editingRole ? "Update" : "Create" }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
