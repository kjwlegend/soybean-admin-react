import { Button, Drawer, Flex, Form, Input, Select } from "antd";
import type { FC } from "react";
import { useRequest } from "@sa/hooks";
import { fetchAgentList } from "@/service/api";

// 用户组模型定义
type UserGroupModel = {
  id?: number;
  name: string;
  description?: string;
  available_agents_ids?: number[];
};

// 必填字段类型
type RuleKey = Extract<keyof UserGroupModel, "name">;

const UserGroupOperateDrawer: FC<Page.OperateDrawerProps> = ({
  form,
  handleSubmit,
  onClose,
  open,
  operateType,
}) => {
  const { t } = useTranslation();

  // 获取可用的 agents 列表
  const { data: agents } = useRequest(
    () => fetchAgentList({ page: 1, size: 100 }),
    {
      manual: false,
    },
  );

  const agentOptions = agents
    ? agents.items.map((agent) => ({
        label: agent.name,
        value: agent.id,
      }))
    : [];

  // 表单验证规则
  const rules: Record<RuleKey, App.Global.FormRule[]> = {
    name: [{ required: true, message: t("ankeai.userGroups.nameRequired") }],
  };

  return (
    <Drawer
      open={open}
      title={
        operateType === "add"
          ? t("ankeai.userGroups.add")
          : t("ankeai.userGroups.edit")
      }
      footer={
        <Flex justify="space-between">
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button type="primary" onClick={handleSubmit}>
            {t("common.confirm")}
          </Button>
        </Flex>
      }
      onClose={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="id" hidden={operateType === "add"}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={t("ankeai.userGroups.name")}
          name="name"
          rules={rules.name}
        >
          <Input placeholder={t("ankeai.form.name")} />
        </Form.Item>

        <Form.Item
          label={t("ankeai.userGroups.description")}
          name="description"
        >
          <Input.TextArea placeholder={t("ankeai.form.description")} rows={4} />
        </Form.Item>

        <Form.Item label={t("ankeai.userGroups.agents")} name="agent_ids">
          <Select
            mode="multiple"
            allowClear
            options={agentOptions}
            placeholder={t("ankeai.form.agents")}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UserGroupOperateDrawer;
