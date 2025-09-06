import { request, ankeRequest } from "../request";

/**
 * 获取Agent分组列表
 */
export function fetchAgentGroupList(params?: Api.Common.CommonSearchParams) {
  return ankeRequest<Api.AnkeAI.AgentGroupList>({
    method: "get",
    params,
    url: "/agent-groups",
  });
}

/**
 * 获取Agent分组详情
 */
export function fetchAgentGroupDetail(groupId: number) {
  return ankeRequest<Api.AnkeAI.AgentGroup>({
    method: "get",
    url: `/agent-groups/${groupId}`,
  });
}

/**
 * 创建Agent分组
 */
export function createAgentGroup(data: Api.AnkeAI.AgentGroupCreateParams) {
  return ankeRequest<Api.AnkeAI.AgentGroup>({
    method: "post",
    data,
    url: "/agent-groups",
  });
}

/**
 * 更新Agent分组
 */
export function updateAgentGroup(
  groupId: number,
  data: Api.AnkeAI.AgentGroupUpdateParams,
) {
  return ankeRequest<Api.AnkeAI.AgentGroup>({
    method: "put",
    data,
    url: `/agent-groups/${groupId}`,
  });
}

/**
 * 删除Agent分组
 */
export function deleteAgentGroup(groupId: number) {
  return ankeRequest<void>({
    method: "delete",
    url: `/agent-groups/${groupId}`,
  });
}

/**
 * 重新排序Agent分组
 */
export function reorderAgentGroups(data: Api.AnkeAI.AgentGroupReorderParams) {
  return ankeRequest<void>({
    method: "put",
    data,
    url: "/agent-groups/reorder",
  });
}

/**
 * 获取分组下的Agent列表
 */
export function fetchGroupAgents(
  groupId: number,
  params?: Api.AnkeAI.AgentSearchParams,
) {
  return ankeRequest<Api.AnkeAI.AgentList>({
    method: "get",
    params,
    url: `/agent-groups/${groupId}/agents`,
  });
}