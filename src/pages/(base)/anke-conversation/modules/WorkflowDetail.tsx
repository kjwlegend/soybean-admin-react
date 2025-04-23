import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

interface ConversationDetailDrawerProps {
  visible: boolean;
  data: any;
  onClose: () => void;
}

const WorkflowLogDetailDrawer: React.FC<ConversationDetailDrawerProps> = ({
  visible,
  data,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!data) return null;

  // 从metadata中提取相关信息
  const workflowInput = data.metadata?.workflow_inputs?.input || "";
  const workflowOutput = data.metadata?.workflow_output || "";
  const usage = data.last_message?.metadata?.usage || {};
  const elapsedTime = data.last_message?.metadata?.elapsed_time || 0;
  const totalTokens = data.last_message?.metadata?.total_tokens || 0;
  const totalSteps = data.last_message?.metadata?.total_steps || 0;

  return (
    <ADrawer
      title={t("ankeai.conversations.detail")}
      width={600}
      open={visible}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <ADescriptions bordered column={1}>
          <ADescriptions.Item label={t("ankeai.conversations.id")}>
            {data.id}
          </ADescriptions.Item>
          <ADescriptions.Item label={t("ankeai.conversations.title")}>
            {data.title || "-"}
          </ADescriptions.Item>
          <ADescriptions.Item label={t("ankeai.conversations.type")}>
            {data.conversation_type}
          </ADescriptions.Item>
          <ADescriptions.Item label={t("ankeai.conversations.user")}>
            {data.user_username}
          </ADescriptions.Item>
          <ADescriptions.Item label={t("ankeai.conversations.agent")}>
            {data.agent_name}
          </ADescriptions.Item>

          <ADescriptions.Item label={t("ankeai.conversations.executionTime")}>
            {`${elapsedTime.toFixed(2) || 0}s`}
          </ADescriptions.Item>
          <ADescriptions.Item label={t("ankeai.conversations.tokenUsage")}>
            {totalTokens || 0}
          </ADescriptions.Item>
          <ADescriptions.Item label={t("ankeai.conversations.totalSteps")}>
            {totalSteps || 0}
          </ADescriptions.Item>
          <ADescriptions.Item label={t("ankeai.createdAt")}>
            {data.created_at
              ? dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </ADescriptions.Item>
        </ADescriptions>

        {workflowInput && (
          <>
            <ADivider orientation="left">
              {t("ankeai.conversations.input")}
            </ADivider>
            <ACard>
              <pre className="whitespace-pre-wrap">{workflowInput}</pre>
            </ACard>
          </>
        )}

        {workflowOutput && (
          <>
            <ADivider orientation="left">
              {t("ankeai.conversations.output")}
            </ADivider>
            <ACard>
              <pre className="whitespace-pre-wrap">{workflowOutput}</pre>
            </ACard>
          </>
        )}

        {Object.keys(usage).length > 0 && (
          <>
            <ADivider orientation="left">
              {t("ankeai.conversations.usage")}
            </ADivider>
            <ACard>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(usage, null, 2)}
              </pre>
            </ACard>
          </>
        )}
      </div>
    </ADrawer>
  );
};

export default WorkflowLogDetailDrawer;
