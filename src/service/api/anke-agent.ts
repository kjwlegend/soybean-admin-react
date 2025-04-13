import { request, ankeRequest } from "../request";

/**
 * 获取Agent列表
 */
export function fetchAgentList(params: Api.AnkeAI.AgentSearchParams) {
  return ankeRequest<Api.AnkeAI.AgentList>({
    method: "get",
    params,
    url: "/agents",
  });
}

/**
 * 获取Agent详情
 */
export function fetchAgentDetail(agentId: number) {
  return ankeRequest<Api.AnkeAI.Agent>({
    method: "get",
    url: `/agents/${agentId}`,
  });
}

/**
 * 创建Agent
 */
export function createAgent(data: Api.AnkeAI.AgentCreateParams) {
  return ankeRequest<Api.AnkeAI.Agent>({
    method: "post",
    data,
    url: "/agents",
  });
}

/**
 * 更新Agent
 */
export function updateAgent(
  agentId: number,
  data: Api.AnkeAI.AgentUpdateParams,
) {
  return ankeRequest<Api.AnkeAI.Agent>({
    method: "put",
    data,
    url: `/agents/${agentId}`,
  });
}

/**
 * 删除Agent
 */
export function deleteAgent(agentId: number) {
  return ankeRequest<void>({
    method: "delete",
    url: `/agents/${agentId}`,
  });
}

/**
 * 同步Agent
 */
export function syncAgent(agentId: number) {
  return ankeRequest<Api.AnkeAI.Agent>({
    method: "post",
    url: `/agents/sync/${agentId}`,
  });
}

/**
 * 获取Agent同步日志
 */
export function fetchAgentSyncLogs(
  agentId: number,
  params: {
    skip?: number;
    limit?: number;
  },
) {
  return ankeRequest<Api.AnkeAI.Agent>({
    method: "get",
    params,
    url: `/agents/sync-logs/${agentId}`,
  });
}
