import type { RouteObject } from "react-router-dom";

import { authRoutes } from "@/router";
import { fetchGetUserRoutes } from "@/service/api";
import { store } from "@/store";

import { isStaticSuper, selectUserInfo } from "../auth/authStore";

import { setHomePath } from "./routeStore";
import {
  filterAuthRoutesByDynamic,
  filterAuthRoutesByRoles,
  mergeValuesByParent,
} from "./shared";

export async function initAuthRoutes(
  addRoutes: (parent: string | null, route: RouteObject[]) => void,
) {
  const authRouteMode = import.meta.env.VITE_AUTH_ROUTE_MODE; // 获取路由模式配置
  const reactAuthRoutes = mergeValuesByParent(authRoutes); // 合并路由配置
  const isSuper = isStaticSuper(store.getState()); // 判断是否超级管理员
  const { roles } = selectUserInfo(store.getState()); // 获取用户角色

  // 静态模式
  if (authRouteMode === "static") {
    // 超级管理员
    if (isSuper) {
      //超级管理员：直接获取所有路由
      reactAuthRoutes.forEach((route) => {
        addRoutes(route.parent, route.route);
      });
    } else {
      // 非超级管理员 普通用户：根据角色过滤路由
      const filteredRoutes = filterAuthRoutesByRoles(reactAuthRoutes, roles);

      filteredRoutes.forEach(({ parent, route }) => {
        addRoutes(parent, route);
      });
    }
  } else {
    // 动态模式
    const { data, error } = await fetchGetUserRoutes();
    if (error) {
      console.error(error);
      return;
    }
    store.dispatch(setHomePath(data.home));

    const filteredRoutes = filterAuthRoutesByDynamic(
      reactAuthRoutes,
      data.routes,
    );

    filteredRoutes.forEach(({ parent, route }) => {
      addRoutes(parent, route);
    });
  }
}
