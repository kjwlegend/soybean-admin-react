import { request, ankeRequest } from "../request";

/* * 获取对话列表
 */
export function fetchConversationList(params: {
  page?: number;
  size?: number;
  conversation_type?: string;
  is_archived?: boolean;
}) {
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
