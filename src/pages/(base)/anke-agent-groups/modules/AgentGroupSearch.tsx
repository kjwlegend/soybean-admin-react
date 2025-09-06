import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, Select, Space } from "antd";

const AgentGroupSearch: FC<Page.SearchProps> = ({
  form,
  reset,
  search,
  searchParams,
}) => {
  const { t } = useTranslation();

  return (
    <Form form={form} initialValues={searchParams} layout="inline">
      <Form.Item label={t("ankeai.agentGroups.name")} name="name">
        <Input
          allowClear
          placeholder={t("ankeai.agentGroups.enterName")}
          style={{ width: 200 }}
        />
      </Form.Item>
      <Form.Item label={t("common.status")} name="status">
        <Select
          allowClear
          placeholder={t("common.pleaseSelect")}
          style={{ width: 120 }}
        >
          <Select.Option value={true}>{t("common.active")}</Select.Option>
          <Select.Option value={false}>{t("common.inactive")}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button onClick={reset}>{t("common.reset")}</Button>
          <Button type="primary" onClick={search}>
            {t("common.search")}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AgentGroupSearch;