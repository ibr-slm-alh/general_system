declare module "#app" {
  interface NuxtApp {
    $api: typeof $api;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $api: typeof $api;
  }
}

export {};
