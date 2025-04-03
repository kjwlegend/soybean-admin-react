import { request } from "../request";

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    method: "get",
    params,
    url: "/admin/roles",
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.RoleList>({
    method: "get",
    url: "/admin/roles",
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    method: "get",
    params,
    url: "/admin/users",
  });
}

/** create admin user */
export function createAdminUser(data: Api.SystemManage.UserCreateParams) {
  return request<Api.SystemManage.User>({
    method: "post",
    data,
    url: "/admin/users",
  });
}

/** update admin user */
export function updateAdminUser(
  userId: number,
  data: Omit<Api.SystemManage.UserCreateParams, "password">,
) {
  return request<Api.SystemManage.User>({
    method: "put",
    data,
    url: `/admin/users/${userId}`,
  });
}

/** Delete admin user */
export function deleteAdminUser(userId: number) {
  return request<void>({
    method: "delete",
    url: `/admin/users/${userId}`,
  });
}
/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    method: "get",
    url: "/systemManage/getMenuList/v2",
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    method: "get",
    url: "/systemManage/getAllPages",
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    method: "get",
    url: "/systemManage/getMenuTree",
  });
}
