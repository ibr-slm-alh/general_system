export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("auth_token");

  const isLoggedIn = !!token.value;

  const publicPages = [
    "/authentication/login",
    "/authentication/register",
    "/authentication/forgotpassword",
  ];

  if (!isLoggedIn && !publicPages.includes(to.path)) {
    return navigateTo("/authentication/login");
  }

  if (isLoggedIn && publicPages.includes(to.path)) {
    return navigateTo("/");
  }
});
