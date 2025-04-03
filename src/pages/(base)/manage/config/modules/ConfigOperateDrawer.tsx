import { Button, Drawer, Flex, Form, Input, Radio, Switch } from "antd";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

import { enableStatusOptions } from "@/constants/business";
import { useFormRules } from "@/features/form";

type Model = Pick<
  Api.SystemManage.ConfigItem,
  "key" | "value" | "description" | "status"
>;

type RuleKey = Extract<keyof Model, "key" | "value">;

const ConfigOperateDrawer: FC<Page.OperateDrawerProps> = ({
  form,
  handleSubmit,
  onClose,
  open,
  operateType,
}) => {
  const { t } = useTranslation();
  const { defaultRequiredRule } = useFormRules();

  const rules: Record<RuleKey, App.Global.FormRule> = {
    key: defaultRequiredRule,
    value: defaultRequiredRule,
  };

  return (
    <Drawer
      open={open}
      title={
        operateType === "add"
          ? t("page.manage.config.addConfig")
          : t("page.manage.config.editConfig")
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
        <Form.Item
          label={t("page.manage.config.key")}
          name="key"
          rules={[rules.key]}
        >
          <Input
            placeholder={t("page.manage.config.form.key")}
            disabled={operateType === "edit"}
          />
        </Form.Item>

        <Form.Item
          label={t("page.manage.config.value")}
          name="value"
          rules={[rules.value]}
        >
          <Input.TextArea
            rows={4}
            placeholder={t("page.manage.config.form.value")}
          />
        </Form.Item>

        <Form.Item
          label={t("page.manage.config.description")}
          name="description"
        >
          <Input.TextArea
            rows={2}
            placeholder={t("page.manage.config.form.description")}
          />
        </Form.Item>

        <Form.Item label={t("page.manage.config.status")} name="status">
          <Radio.Group>
            {enableStatusOptions.map((item) => (
              <Radio key={item.value} value={item.value}>
                {t(item.label)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ConfigOperateDrawer;
