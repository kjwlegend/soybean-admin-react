/* prettier-ignore */
/* eslint-disable */
// Generated by elegant-router
// Read more: https://github.com/mufeng889/elegant-router
// Vue auto route: https://github.com/soybeanjs/elegant-router
// 请不要手动修改此文件，否则会导致优雅路由无法正常工作
// 如果需要修改，请在优雅路由配置文件中进行修改
// 这是自动生成的文件，请不要手动修改



export const layouts: Record<string, () => Promise<any>> = {
"(base)": () => import("@/pages/(base)/layout.tsx"),
"(blank)": () => import("@/pages/(blank)/layout.tsx"),
"(blank)_login": () => import("@/pages/(blank)/login/layout.tsx"),
"root": () => import("@/pages/layout.tsx"),
};

export const pages: Record<string, () => Promise<any>> = {
"(base)_about": () => import("@/pages/(base)/about/index.tsx"),
"(base)_function_event-bus": () => import("@/pages/(base)/function/event-bus/index.tsx"),
"(base)_function_hide-child": () => import("@/pages/(base)/function/hide-child/index.tsx"),
"(base)_function_hide-child_one": () => import("@/pages/(base)/function/hide-child/one/index.tsx"),
"(base)_function_hide-child_three": () => import("@/pages/(base)/function/hide-child/three/index.tsx"),
"(base)_function_hide-child_two": () => import("@/pages/(base)/function/hide-child/two/index.tsx"),
"(base)_function": () => import("@/pages/(base)/function/index.tsx"),
"(base)_function_multi-tab": () => import("@/pages/(base)/function/multi-tab/index.tsx"),
"(base)_function_request": () => import("@/pages/(base)/function/request/index.tsx"),
"(base)_function_super-page": () => import("@/pages/(base)/function/super-page/index.tsx"),
"(base)_function_tab": () => import("@/pages/(base)/function/tab/index.tsx"),
"(base)_function_toggle-auth": () => import("@/pages/(base)/function/toggle-auth/index.tsx"),
"(base)_home": () => import("@/pages/(base)/home/index.tsx"),
"(base)_manage": () => import("@/pages/(base)/manage/index.tsx"),
"(base)_manage_role_[...slug]": () => import("@/pages/(base)/manage/role/[...slug].tsx"),
"(base)_manage_role": () => import("@/pages/(base)/manage/role/index.tsx"),
"(base)_manage_user_[id]": () => import("@/pages/(base)/manage/user/[id].tsx"),
"(base)_manage_user": () => import("@/pages/(base)/manage/user/index.tsx"),
"(base)_multi-menu_first_child": () => import("@/pages/(base)/multi-menu/first/child/index.tsx"),
"(base)_multi-menu_first": () => import("@/pages/(base)/multi-menu/first/index.tsx"),
"(base)_multi-menu": () => import("@/pages/(base)/multi-menu/index.tsx"),
"(base)_multi-menu_second_child_home": () => import("@/pages/(base)/multi-menu/second/child/home/index.tsx"),
"(base)_multi-menu_second_child": () => import("@/pages/(base)/multi-menu/second/child/index.tsx"),
"(base)_multi-menu_second": () => import("@/pages/(base)/multi-menu/second/index.tsx"),
"(base)_projects_[pid]_edit_[id]": () => import("@/pages/(base)/projects/[pid]/edit/[id].tsx"),
"(base)_projects_[pid]_edit": () => import("@/pages/(base)/projects/[pid]/edit/index.tsx"),
"(base)_projects_[pid]": () => import("@/pages/(base)/projects/[pid]/index.tsx"),
"(base)_projects": () => import("@/pages/(base)/projects/index.tsx"),
"(base)_user-center": () => import("@/pages/(base)/user-center/index.tsx"),
"(blank)_login-out": () => import("@/pages/(blank)/login-out/index.tsx"),
"(blank)_login_code-login": () => import("@/pages/(blank)/login/code-login/index.tsx"),
"(blank)_login": () => import("@/pages/(blank)/login/index.tsx"),
"(blank)_login_register": () => import("@/pages/(blank)/login/register/index.tsx"),
"(blank)_login_reset-pwd": () => import("@/pages/(blank)/login/reset-pwd/index.tsx"),
"403": () => import("@/pages/_builtin/403/index.tsx"),
"404": () => import("@/pages/_builtin/404/index.tsx"),
"500": () => import("@/pages/_builtin/500/index.tsx"),
"iframe-page": () => import("@/pages/_builtin/iframe-page/index.tsx"),
"root": () => import("@/pages/index.tsx"),
};

export const errors: Record<string, () => Promise<any>> = {
"root": () => import("@/pages/error.tsx"),
};