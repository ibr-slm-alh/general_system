export default defineNuxtPlugin(() => {
  if (process.server) return;

  const { initAuth } = useAuth();

  onNuxtReady(async () => {
    await initAuth();
  });
});
