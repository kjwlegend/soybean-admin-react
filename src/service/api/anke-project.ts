import { request, ankeRequest } from "../request";

/**
 * 获取项目列表
 */
export function fetchProjectList(params: Api.AnkeAI.ProjectSearchParams) {
  return ankeRequest<Api.AnkeAI.ProjectList>({
    method: "get",
    params,
    url: "/projects",
  });
}

/**
 * 获取项目详情
 */
export function fetchProjectDetail(projectId: number) {
  return ankeRequest<Api.AnkeAI.Project>({
    method: "get",
    url: `/projects/${projectId}`,
  });
}

/**
 * 创建项目
 */
export function createProject(data: Api.AnkeAI.ProjectCreateParams) {
  return ankeRequest<Api.AnkeAI.Project>({
    method: "post",
    data,
    url: "/projects",
  });
}

/**
 * 更新项目
 */
export function updateProject(
  projectId: number,
  data: Api.AnkeAI.ProjectUpdateParams,
) {
  return ankeRequest<Api.AnkeAI.Project>({
    method: "put",
    data,
    url: `/projects/${projectId}`,
  });
}

/**
 * 删除项目
 */
export function deleteProject(projectId: number) {
  return ankeRequest<void>({
    method: "delete",
    url: `/projects/${projectId}`,
  });
}

/**
 * 获取项目成员列表
 */
export function fetchProjectMembers(projectId: number, params?: Api.Common.CommonSearchParams) {
  return ankeRequest<Api.AnkeAI.ProjectMembershipList>({
    method: "get",
    params,
    url: `/projects/${projectId}/members`,
  });
}

/**
 * 添加项目成员
 */
export function addProjectMember(
  projectId: number,
  data: Api.AnkeAI.ProjectMembershipCreateParams,
) {
  return ankeRequest<Api.AnkeAI.ProjectMembership>({
    method: "post",
    data,
    url: `/projects/${projectId}/members`,
  });
}

/**
 * 更新项目成员
 */
export function updateProjectMember(
  projectId: number,
  membershipId: number,
  data: Api.AnkeAI.ProjectMembershipUpdateParams,
) {
  return ankeRequest<Api.AnkeAI.ProjectMembership>({
    method: "put",
    data,
    url: `/projects/${projectId}/members/${membershipId}`,
  });
}

/**
 * 移除项目成员
 */
export function removeProjectMember(projectId: number, membershipId: number) {
  return ankeRequest<void>({
    method: "delete",
    url: `/projects/${projectId}/members/${membershipId}`,
  });
}

/**
 * 获取当前用户的项目列表
 */
export function fetchUserProjects(params?: Api.Common.CommonSearchParams) {
  return ankeRequest<Api.AnkeAI.ProjectList>({
    method: "get",
    params,
    url: "/projects/my-projects",
  });
}