// echo.client.ts
import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const echo = new Echo({
    broadcaster: "reverb",
    key: "local",
    wsHost: config.public.reverbHost,
    wsPort: Number(config.public.reverbPort),
    wssPort: Number(config.public.reverbPort),
    forceTLS: false,
    enabledTransports: ["ws"],
  });

  return { provide: { echo } };
});
