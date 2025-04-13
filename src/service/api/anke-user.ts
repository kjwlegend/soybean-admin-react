import { request, ankeRequest } from "../request";

/**
 * 获取用户列表
 */
export function fetchUserList(params: Api.AnkeAI.UserSearchParams) {
  return ankeRequest<Api.AnkeAI.UserList>({
    method: "get",
    params,
    url: "/users/users",
  });
}

/**
 * 获取用户详情
 */
export function fetchUserDetail(userId: number) {
  return ankeRequest<Api.AnkeAI.User>({
    method: "get",
    url: `/users/users/${userId}`,
  });
}

/**
 * 创建用户
 */
export function createUser(data: Api.AnkeAI.UserCreateParams) {
  return ankeRequest<Api.AnkeAI.User>({
    method: "post",
    data,
    url: "/users/users",
  });
}

/**
 * 更新用户
 */
export function updateUser(userId: number, data: Api.AnkeAI.UserUpdateParams) {
  return ankeRequest<Api.AnkeAI.User>({
    method: "put",
    data,
    url: `/users/users/${userId}`,
  });
}

/**
 * 删除用户
 */
export function deleteUser(userId: number) {
  return ankeRequest<void>({
    method: "delete",
    url: `/users/users/${userId}`,
  });
}

/**
 * 获取用户组列表
 */
export function fetchUserGroupList(params: Api.AnkeAI.UserGroupSearchParams) {
  return ankeRequest<Api.AnkeAI.UserGroupList>({
    method: "get",
    params,
    url: "/users/user-groups",
  });
}

/**
 * 获取用户组详情
 */
export function fetchUserGroupDetail(groupId: number) {
  return ankeRequest<Api.AnkeAI.User>({
    method: "get",
    url: `/users/user-groups/${groupId}`,
  });
}

/**
 * 创建用户组
 */
export function createUserGroup(data: Api.AnkeAI.UserGroupCreateParams) {
  return ankeRequest<Api.AnkeAI.UserGroup>({
    method: "post",
    data,
    url: "/users/user-groups",
  });
}

/**
 * 更新用户组
 */
export function updateUserGroup(
  groupId: number,
  data: Api.AnkeAI.UserGroupUpdateParams,
) {
  return ankeRequest<Api.AnkeAI.User>({
    method: "put",
    data,
    url: `/users/user-groups/${groupId}`,
  });
}

/**
 * 删除用户组
 */
export function deleteUserGroup(groupId: number) {
  return ankeRequest<void>({
    method: "delete",
    url: `/users/user-groups/${groupId}`,
  });
}
