import { Button, Drawer, Flex, Form, Input } from "antd";
import { useEffect } from "react";
import type { FC } from "react";

import { useFormRules } from "@/features/form";
import { useTranslation } from "react-i18next";

type Model = Api.AnkeAI.ProjectCreateParams & {
  id?: number;
};

type RuleKey = Extract<keyof Model, "title">;

const ProjectOperateDrawer: FC<Page.OperateDrawerProps> = ({
  form,
  handleSubmit,
  onClose,
  open,
  operateType,
}) => {
  const { t } = useTranslation();

  const { defaultRequiredRule } = useFormRules();

  const rules: Record<RuleKey, App.Global.FormRule[]> = {
    title: [defaultRequiredRule],
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer
      open={open}
      title={
        operateType === "add"
          ? t("ankeai.projects.addProject")
          : t("ankeai.projects.editProject")
      }
      footer={
        <Flex justify="space-between">
          <Button onClick={handleClose}>{t("common.cancel")}</Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
          >
            {t("common.confirm")}
          </Button>
        </Flex>
      }
      onClose={handleClose}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="id" label="ID" hidden={operateType === "add"}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={t("ankeai.projects.title")}
          name="title"
          rules={rules.title}
        >
          <Input placeholder={t("ankeai.projects.enterTitle")} />
        </Form.Item>

        <Form.Item 
          label={t("ankeai.projects.description")} 
          name="description"
        >
          <Input.TextArea 
            placeholder={t("ankeai.projects.enterDescription")} 
            rows={4} 
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ProjectOperateDrawer;