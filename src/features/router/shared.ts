import type { RouteObject } from 'react-router-dom';

/**
 * 过滤需要缓存的路由
 * 遍历路由树，找出所有设置了 keepAlive 的路由路径
 * @param routes 路由对象数组
 * @returns 需要缓存的路由路径数组
 */
export function filterCacheRoutes(routes: RouteObject[]) {
  const cacheRoutes: string[] = [];

  for (const route of routes) {
    const { children, handle, path } = route;
    // 如果节点存在 path（注意：这里假设空字符串或 undefined 均视为无 path）
    if (path) {
      // 如果路由配置了 keepAlive，将其路径添加到缓存列表
      if (handle?.keepAlive) {
        cacheRoutes.push(path);
      }

      // 递归处理子路由
      if (children && children.length) {
        cacheRoutes.push(...filterCacheRoutes(children));
      }
    } else if (children && children.length) {
      // 如果当前节点没有 path，但有 children，则递归处理 children
      cacheRoutes.push(...filterCacheRoutes(children));
      // 如果既没有 path 也没有 children，则该节点直接被过滤掉
    }
  }

  return cacheRoutes;
}

/**
 * 根据父路由合并路由配置
 * 将具有相同父路由的配置合并到一起
 * @param data 权限路由数组
 * @returns 合并后的路由配置
 */
export function mergeValuesByParent(data: Router.SingleAuthRoute[]) {
  const merged: Record<string, Router.AuthRoute> = {};

  data.forEach(item => {
    // 使用一个变量作为 key，若 parent 为 null，则转换为字符串 "null"
    const key = item.parent === null ? 'null' : item.parent;
    if (!merged[key]) {
      merged[key] = {
        parent: item.parent, // 保持原始 parent 值，包括 null
        parentPath: item.parentPath,
        route: []
      };
    }
    merged[key].route.push(item.route);
  });
  // 按父路由名称排序
  return Object.values(merged).sort((a, b) => a.parent?.localeCompare(b.parent || '') || 0);
}

/**
 * 根据用户角色过滤路由
 * 检查每个路由的权限要求，只保留用户有权访问的路由
 * @param routes 路由配置数组
 * @param roles 用户角色数组
 * @returns 过滤后的路由配置
 */
export function filterAuthRoutesByRoles(routes: { parent: string | null; route: RouteObject[] }[], roles: string[]) {
  return routes
    .map(item => {
      // 处理索引路由的特殊情况
      if (item.route[0]?.index) {
        const routeRoles: string[] = (item.route[0].handle && item.route[0].handle.roles) || [];
        const hasPermission = routeRoles.some(role => roles.includes(role));
        const isEmptyRoles = !routeRoles.length;

        // 如果路由需要权限但用户没有权限，返回空路由
        if (!isEmptyRoles && !hasPermission) {
          return {
            parent: item.parent,
            route: []
          };
        }
      }

      // 过滤每个路由对象
      const filteredRoute = item.route.filter(routeObj => {
        const routeRoles: string[] = (routeObj.handle && routeObj.handle.roles) || [];

        // if the route's "roles" is empty, then it is allowed to access
        const isEmptyRoles = !routeRoles.length;

        // if the user's role is included in the route's "roles", then it is allowed to access
        const hasPermission = routeRoles.some(role => roles.includes(role));

        // 返回无需权限或用户有权限的路由
        return hasPermission || isEmptyRoles;
      });

      // 返回结构与原始一致，但 route 已经过滤过
      return {
        parent: item.parent,
        route: filteredRoute
      };
    })
    // 移除没有有效路由的配置
    .filter(item => item.route.length >= 1);
}

/**
 * 根据动态路由配置过滤路由
 * 根据后端返回的可访问路由路径列表过滤前端路由
 * @param routes 前端路由配置
 * @param hasRoutes 后端返回的可访问路由路径
 * @returns 过滤后的路由配置
 */
export function filterAuthRoutesByDynamic(routes: Router.AuthRoute[], hasRoutes: string[]) {
  return routes
    .map(item => {
      // 过滤路由数组
      const filteredRoute = item.route.filter(routeObj => {
        // 处理索引路由：如果父路径在允许列表中则保留
        if (routeObj?.index && hasRoutes.includes(item?.parentPath || '')) {
          return true;
        }
        // 检查路由路径是否在允许列表中
        return hasRoutes.includes(routeObj.path || '');
      });

      // 返回结构与原始一致，但 route 已经过滤过
      return {
        parent: item.parent,
        route: filteredRoute
      };
    })
    // 移除没有有效路由的配置
    .filter(item => item.route.length >= 1);
}
