import { useCookie } from "@nuxt/ui/runtime/vue/stubs/base.js";
import { navigateTo } from "nuxt/app";

export const api = $fetch.create({
  baseURL: "http://localhost:8085/api",

  onRequest({ options }) {
    const token = useCookie<string | null>("auth_token");

    if (token.value) {
      options.headers.set("authorization", `Bearer ${token.value}`);
    }

    options.headers.set("Accept", "aplication/json");
  },

  onRequestError({ response }) {
    if (response?.status === 401) {
      navigateTo("/login");
    }
  },
});
