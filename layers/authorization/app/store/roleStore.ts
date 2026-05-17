export const roleStore = defineStore("role.store", () => {
  const roles = ref(null);

  function setRoles(allRoles) {
    roles.value = allRoles;
  }

  function removeRole(id: number) {
    roles.value = (this.roles ?? []).filter((role: any) => role.id !== id);
  }
  return {
    // state
    roles,

    // actions
    setRoles,
    removeRole,
  };
});
