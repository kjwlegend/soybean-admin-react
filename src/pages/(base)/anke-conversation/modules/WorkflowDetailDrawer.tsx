import { useState, useEffect } from "react"; // Import useState and useEffect
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { fetchConversationMessages } from "@/service/api/anke-conversation"; // Assuming this is the correct path
import {
  Drawer as ADrawer,
  Descriptions as ADescriptions,
  Divider as ADivider,
  Card as ACard,
  Spin,
  Empty,
} from "antd"; // Assuming Ant Design components

// Define an interface for your message structure
interface Message {
  id: number;
  content: string;
  role: "user" | "assistant" | string;
  metadata: any;
  token_count: number;
  created_at: string;
  conversation_id: number;
}

interface WorkflowDetailDrawerProps {
  visible: boolean;
  data: any; // Consider defining a more specific type for data
  onClose: () => void;
}

const WorkflowDetailDrawer: React.FC<WorkflowDetailDrawerProps> = ({
  visible,
  data,
  onClose,
}) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Api.AnkeAI.Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);

  useEffect(() => {
    if (visible && data?.id) {
      const getMessages = async (conversationId: number) => {
        setIsLoadingMessages(true);
        try {
          const response = await fetchConversationMessages(conversationId, {
            page: 1,
            size: 1000,
          });
          if (response.data?.items) {
            // Sort messages by creation time, oldest first
            setMessages(
              response.data.items.sort(
                (a: Api.AnkeAI.Message, b: Api.AnkeAI.Message) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime(),
              ),
            );
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
      setMessages([]); // Reset messages when drawer is closed
    }
  }, [visible, data?.id]);

  if (!data) return null;

  console.log("Workflow Detail Data:", data);

  const workflowInput = (() => {
    try {
      const input = data.metadata?.workflow_inputs;
      // Check if input is an empty object
      if (
        typeof input === "object" &&
        input !== null &&
        Object.keys(input).length === 0
      ) {
        return "{}"; // Explicitly show empty object
      }
      return typeof input === "object" && input !== null
        ? JSON.stringify(input, null, 2)
        : "无输入数据";
    } catch (e) {
      console.error("Error parsing workflow input:", e);
      return "数据格式错误";
    }
  })();

  const workflowOutput = (() => {
    try {
      const output = data.metadata?.workflow_output;
      if (typeof output === "object" && output !== null) {
        if ("text" in output && typeof output.text === "string") {
          return output.text;
        }
        if (Object.keys(output).length === 0) {
          return "无输出数据"; // Or "{}" if you prefer for empty objects
        }
        return JSON.stringify(output, null, 2);
      } else if (typeof output === "string" && output.trim() !== "") {
        return output; // If output itself is a non-empty string
      }
      return "无输出数据";
    } catch (e) {
      console.error("Error parsing workflow output:", e);
      return "数据格式错误";
    }
  })();

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

  const formatPrice = (price: string | number | undefined) => {
    if (price === undefined || price === null) return "$0.000000";
    const numPrice = Number(price);
    return `$${numPrice.toFixed(6)}`;
  };

  const elapsedTime = typeof usage?.latency === "number" ? usage.latency : 0;
  const totalTokens =
    typeof usage?.total_tokens === "number" ? usage.total_tokens : 0;

  return (
    <ADrawer
      title={t("ankeai.workflows.detailTitle", "工作流执行详情")} // Example: Provide a default value or ensure key exists
      width={1200} // Adjusted width for two columns
      open={visible}
      onClose={onClose}
      destroyOnClose
    >
      <div className="flex gap-6 h-full">
        {/* Left Column: Workflow Details, Input, Output */}
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
                {`${elapsedTime.toFixed(2)}s`}
              </ADescriptions.Item>
              <ADescriptions.Item label={t("ankeai.conversations.tokenUsage")}>
                <div>
                  {t("ankeai.conversations.totalTokens", "总Token数")}:{" "}
                  {totalTokens}
                  <br />
                  {t("ankeai.conversations.promptTokens", "Prompt Token")}:{" "}
                  {usage.prompt_tokens || 0}
                  <br />
                  {t(
                    "ankeai.conversations.completionTokens",
                    "Completion Token",
                  )}
                  : {usage.completion_tokens || 0}
                </div>
              </ADescriptions.Item>
              <ADescriptions.Item
                label={t("ankeai.conversations.costInfo", "费用信息")}
              >
                <div>
                  {t("ankeai.conversations.totalCost", "总费用")}:{" "}
                  {formatPrice(usage.total_price)}
                  <br />
                  {t("ankeai.conversations.promptCost", "Prompt费用")}:{" "}
                  {formatPrice(usage.prompt_price)}
                  <br />
                  {t(
                    "ankeai.conversations.completionCost",
                    "Completion费用",
                  )}: {formatPrice(usage.completion_price)}
                </div>
              </ADescriptions.Item>
              <ADescriptions.Item label={t("ankeai.createdAt")}>
                {data.created_at
                  ? dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")
                  : "-"}
              </ADescriptions.Item>
            </ADescriptions>

            {workflowInput &&
              workflowInput !== "无输入数据" &&
              workflowInput !== "数据格式错误" && (
                <>
                  <ADivider orientation="left" plain>
                    {t("ankeai.workflows.input", "工作流输入")}
                  </ADivider>
                  <ACard size="small">
                    <pre className="whitespace-pre-wrap text-xs p-2 bg-gray-50 rounded overflow-x-auto">
                      {workflowInput}
                    </pre>
                  </ACard>
                </>
              )}

            {workflowOutput &&
              workflowOutput !== "无输出数据" &&
              workflowOutput !== "数据格式错误" && (
                <>
                  <ADivider orientation="left" plain>
                    {t("ankeai.workflows.output", "工作流输出")}
                  </ADivider>
                  <ACard size="small">
                    <pre className="whitespace-pre-wrap text-xs p-2 bg-gray-50 rounded overflow-x-auto">
                      {workflowOutput}
                    </pre>
                  </ACard>
                </>
              )}
          </div>
        </div>

        {/* Right Column: Messages */}
        <div className="w-1/2 flex-grow flex flex-col overflow-y-auto pl-3">
          <h3 className="text-base font-semibold mb-3 sticky top-0 bg-white py-2 z-10 border-b">
            {t("ankeai.conversations.messagesLog", "对话记录")}
          </h3>
          {isLoadingMessages ? (
            <div className="flex justify-center items-center h-full">
              <Spin />
            </div>
          ) : messages.length > 0 ? (
            <div className="flex-grow space-y-3 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[85%] shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-xs font-medium mb-1">
                      {msg.role === "user"
                        ? t("ankeai.conversations.userRole", "用户")
                        : t("ankeai.conversations.assistantRole", "助手")}
                      <span className="ml-2 text-xs opacity-70">
                        ({dayjs(msg.created_at).format("HH:mm:ss")})
                      </span>
                    </p>
                    <div
                      className="text-sm"
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <Empty
                description={t(
                  "ankeai.conversations.noMessages",
                  "暂无对话记录",
                )}
              />
            </div>
          )}
        </div>
      </div>
    </ADrawer>
  );
};

export default WorkflowDetailDrawer;
