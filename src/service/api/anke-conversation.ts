import { request, ankeRequest } from "../request";

/**
 * 获取对话列表
 */
export function fetchConversationList(params: Api.AnkeAI.ConversationSearchParams) {
  return ankeRequest<Api.AnkeAI.ConversationList>({
    method: "get",
    params,
    url: "/conversations",
  });
}

/**
 * 获取对话详情
 */
export function fetchConversationDetail(conversationId: number) {
  return ankeRequest<Api.AnkeAI.ConversationDetail>({
    method: "get",
    url: `/conversations/${conversationId}`,
  });
}

/**
 * 删除对话
 */
export function deleteConversation(conversationId: number) {
  return ankeRequest<{ message: string }>({
    method: "delete",
    url: `/conversations/${conversationId}`,
  });
}

/**
 * 获取对话消息列表
 */
export function fetchConversationMessages(
  conversationId: number,
  params: {
    page?: number;
    size?: number;
  },
) {
  return ankeRequest<Api.AnkeAI.MessageList>({
    method: "get",
    url: `/conversations/${conversationId}/messages`,
    params,
  });
}

/**
 * 置顶/取消置顶对话
 */
export function toggleConversationPin(conversationId: number, pinned: boolean) {
  return ankeRequest<Api.AnkeAI.Conversation>({
    method: "put",
    data: { pinned },
    url: `/conversations/${conversationId}/pin`,
  });
}

/**
 * 更新对话项目关联
 */
export function updateConversationProject(conversationId: number, projectId: number | null) {
  return ankeRequest<Api.AnkeAI.Conversation>({
    method: "put",
    data: { project_id: projectId },
    url: `/conversations/${conversationId}/project`,
  });
}

/**
 * 根据项目获取对话列表
 */
export function fetchConversationsByProject(
  projectId: number,
  params?: Api.AnkeAI.ConversationSearchParams,
) {
  return ankeRequest<Api.AnkeAI.ConversationList>({
    method: "get",
    params: { ...params, project_id: projectId },
    url: "/conversations",
  });
}

/**
 * 批量操作对话 (置顶、取消置顶、分配项目)
 */
export function batchUpdateConversations(data: {
  conversation_ids: number[];
  pinned?: boolean;
  project_id?: number | null;
}) {
  return ankeRequest<void>({
    method: "put",
    data,
    url: "/conversations/batch-update",
  });
}
