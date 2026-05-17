export default defineNuxtPlugin(() => {
  const token = useCookie("auth_token");

  const api = $fetch.create({
    baseURL: "http://localhost:8085/api",
    headers: {
      Accept: "application/json",
    },

    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Accept: "application/json",

          Authorization: `Bearer ${token.value}`,
        };
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
