<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>

<template>
  <UModal v-model:open="isOpen" :title="title ?? 'Confirm Delete'">
    <template #body>
      <p class="text-(--ui-text-muted) text-sm">
        {{ description ?? "Are you sure? This action cannot be undone." }}
      </p>

      <div class="flex justify-end gap-2 mt-6">
        <UButton color="neutral" variant="ghost" @click="isOpen = false">
          Cancel
        </UButton>
        <UButton color="error" :loading="loading" @click="emit('confirm')">
          Delete
        </UButton>
      </div>
    </template>
  </UModal>
</template>
