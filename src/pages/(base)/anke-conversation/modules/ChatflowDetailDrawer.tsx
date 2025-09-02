import { useState, useEffect } from "react"; // Import useState and useEffect
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { fetchConversationMessages } from "@/service/api/anke-conversation";
import {
  Drawer as ADrawer,
  Descriptions as ADescriptions,
  Divider as ADivider,
  Card as ACard,
  Spin, // For loading state
  Empty, // For no messages
} from "antd"; // Assuming you are using antd components like Drawer, Descriptions etc.

// Define an interface for your message structure for better type safety
interface Message {
  id: number;
  content: string;
  role: "user" | "assistant" | string; // Allow other roles if any
  metadata: any; // Or a more specific type if known
  token_count: number;
  created_at: string;
  conversation_id: number;
}

interface ConversationDetailDrawerProps {
  visible: boolean;
  data: any; // Consider defining a more specific type for data
  onClose: () => void;
}

const ChatflowDetailDrawer: React.FC<ConversationDetailDrawerProps> = ({
  visible,
  data,
  onClose,
}) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Api.AnkeAI.Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);

  // Effect to fetch messages when the drawer is visible and data.id is available
  useEffect(() => {
    if (visible && data?.id) {
      const getMessages = async (conversationId: number) => {
        setIsLoadingMessages(true);
        try {
          const response = await fetchConversationMessages(conversationId, {
            page: 1,
            size: 1000, // Or make this configurable/paginated
          });
          if (response.data?.items) {
            setMessages(
              response.data.items.sort(
                (a: Api.AnkeAI.Message, b: Api.AnkeAI.Message) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime(),
              ),
            ); // Sort by creation time
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.error("Error fetching conversation messages:", error);
          setMessages([]);
        } finally {
          setIsLoadingMessages(false);
        }
      };
      getMessages(data.id);
    } else if (!visible) {
      // Reset messages when drawer is closed
      setMessages([]);
    }
  }, [visible, data?.id]); // Re-run if visible or data.id changes

  if (!data) return null;

  // Safely get usage data
  const usage = (() => {
    try {
      const usageData = data.metadata?.usage;
      return typeof usageData === "object" && usageData !== null
        ? usageData
        : {};
    } catch (e) {
      return {};
    }
  })();

  const elapsedTime = typeof usage?.latency === "number" ? usage.latency : 0;
  const totalTokens =
    typeof usage?.total_tokens === "number" ? usage.total_tokens : 0;

  const formatPrice = (price: string | number | undefined) => {
    if (price === undefined) return "$0.000000";
    const numPrice = Number(price);
    return `$${numPrice.toFixed(6)}`;
  };

  return (
    <ADrawer
      title={t("ankeai.conversations.detail")}
      width={1000} // Increased width for two columns
      open={visible}
      onClose={onClose}
      destroyOnClose // Good practice to reset state of drawer content on close
    >
      <div className="flex gap-6 h-full">
        {/* Left Column: Conversation Details */}
        <div className="w-1/2 flex-shrink-0 overflow-y-auto pr-3 border-r border-gray-200">
          <div className="flex flex-col gap-4">
            <ADescriptions bordered column={1} size="small">
              <ADescriptions.Item label={t("ankeai.conversations.id")}>
                {data.id || "-"}
              </ADescriptions.Item>
              <ADescriptions.Item label={t("ankeai.conversations.title")}>
                {data.title || "-"}
              </ADescriptions.Item>
              <ADescriptions.Item label={t("ankeai.conversations.type")}>
                {data.conversation_type || "-"}
              </ADescriptions.Item>
              <ADescriptions.Item label={t("ankeai.conversations.user")}>
                {data.user_username || "-"}
              </ADescriptions.Item>
              <ADescriptions.Item label={t("ankeai.conversations.agent")}>
                {data.agent_name || "-"}
              </ADescriptions.Item>
              <ADescriptions.Item
                label={t("ankeai.conversations.executionTime")}
              >
                {`${elapsedTime.toFixed(2) || 0}s`}
              </ADescriptions.Item>
              <ADescriptions.Item label={t("ankeai.conversations.tokenUsage")}>
                <div>
                  {t("ankeai.conversations.totalTokens")}: {totalTokens || 0}
                  <br />
                  {t("ankeai.conversations.promptTokens")}:{" "}
                  {usage.prompt_tokens || 0}
                  <br />
                  {t("ankeai.conversations.completionTokens")}:{" "}
                  {usage.completion_tokens || 0}
                </div>
              </ADescriptions.Item>
              <ADescriptions.Item label={t("ankeai.conversations.costInfo")}>
                <div>
                  {t("ankeai.conversations.totalCost")}:{" "}
                  {formatPrice(usage.total_price)}
                  <br />
                  {t("ankeai.conversations.promptCost")}:{" "}
                  {formatPrice(usage.prompt_price)}
                  <br />
                  {t("ankeai.conversations.completionCost")}:{" "}
                  {formatPrice(usage.completion_price)}
                </div>
              </ADescriptions.Item>
              <ADescriptions.Item label={t("ankeai.createdAt")}>
                {data.created_at
                  ? dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")
                  : "-"}
              </ADescriptions.Item>
            </ADescriptions>
          </div>
        </div>

        {/* Right Column: Messages */}
        <div className="w-1/2 flex-grow flex flex-col overflow-y-auto pl-3">
          <h3 className="text-base font-semibold mb-3 sticky top-0 bg-white py-2 z-10 border-b">
            {t("ankeai.conversations.messages")}
          </h3>
          {isLoadingMessages ? (
            <div className="flex justify-center items-center h-full">
              <Spin />
            </div>
          ) : messages.length > 0 ? (
            <div className="flex-grow space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] break-words ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-xs font-medium mb-1">
                      {msg.role === "user"
                        ? t("ankeai.conversations.user")
                        : t("ankeai.conversations.assistant")}
                      <span className="ml-2 text-gray-400 text-xs">
                        ({dayjs(msg.created_at).format("HH:mm:ss")})
                      </span>
                    </p>
                    {/* Using pre-wrap to respect newlines in content */}
                    <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <Empty description={t("ankeai.conversations.noMessages")} />
            </div>
          )}
        </div>
      </div>
    </ADrawer>
  );
};

export default ChatflowDetailDrawer;
