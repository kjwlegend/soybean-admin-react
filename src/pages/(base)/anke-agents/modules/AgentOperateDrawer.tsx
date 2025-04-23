import { useRequest } from "@sa/hooks";
import { Button, Drawer, Flex, Form, Input, Select, Switch } from "antd";
import type { FC } from "react";

import { useFormRules } from "@/features/form";
import { fetchUserGroupList } from "@/service/api";

interface OptionsProps {
  label: string;
  value: number;
}

type Model = {
  id?: number;
  name: string;
  description?: string;
  api_key?: string;
  status?: string;
  user_groups?: number[];
  force_update?: boolean;
};

type RuleKey = Extract<keyof Model, "name" | "api_key" | "status">;

const AgentOperateDrawer: FC<Page.OperateDrawerProps> = ({
  form,
  handleSubmit,
  onClose,
  open,
  operateType,
}) => {
  const { t } = useTranslation();

  const { data: userGroups } = useRequest(
    () => fetchUserGroupList({ page: 1, size: 100 }),
    {
      manual: false,
    },
  );

  const { defaultRequiredRule, patternRules } = useFormRules();

  const userGroupOptions: OptionsProps[] = userGroups
    ? userGroups.items.map((group) => ({
        label: group.name,
        value: group.id,
      }))
    : [];

  const rules: Record<RuleKey, App.Global.FormRule[]> = {
    name: [defaultRequiredRule],
    api_key: [defaultRequiredRule],
    status: [defaultRequiredRule],
  };

  return (
    <Drawer
      open={open}
      title={
        operateType === "add"
          ? t("page.manage.agent.addAgent")
          : t("page.manage.agent.editAgent")
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
        <Form.Item name="id" label="id" hidden={operateType === "add"}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={t("ankeai.agents.name")}
          name="name"
          rules={rules.name}
        >
          <Input placeholder={t("ankeai.form.name")} />
        </Form.Item>

        <Form.Item label={t("ankeai.agents.description")} name="description">
          <Input.TextArea placeholder={t("ankeai.form.description")} rows={4} />
        </Form.Item>

        <Form.Item
          label={t("ankeai.agents.type")}
          name="type"
          initialValue={"chat"}
        >
          <Select
            options={[
              { label: t("ankeai.agents.chat"), value: "chat" },
              { label: t("ankeai.agents.workflow"), value: "workflow" },
            ]}
            placeholder={t("ankeai.form.type")}
          />
        </Form.Item>

        <Form.Item
          label={t("ankeai.agents.apiKey")}
          name="api_key"
          rules={operateType === "add" ? rules.api_key : []}
        >
          <Input.Password placeholder={t("ankeai.form.apiKey")} />
        </Form.Item>

        <Form.Item
          label={t("ankeai.agents.status")}
          name="status"
          rules={rules.status}
          initialValue="active"
        >
          <Select
            options={[
              { label: t("ankeai.status.active"), value: "active" },
              {
                label: t("ankeai.status.inactive"),
                value: "inactive",
              },
            ]}
            placeholder={t("ankeai.form.status")}
          />
        </Form.Item>

        <Form.Item label={t("ankeai.agents.userGroups")} name="user_group_ids">
          <Select
            mode="multiple"
            options={userGroupOptions}
            placeholder={t("ankeai.form.userGroups")}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AgentOperateDrawer;
