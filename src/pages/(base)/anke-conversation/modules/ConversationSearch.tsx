import { Button, Col, Flex, Form, Select } from "antd";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const ConversationSearch: FC<Page.SearchProps> = ({
  form,
  reset,
  search,
  searchParams,
}) => {
  const { t } = useTranslation();

  return (
    <Form form={form} layout="inline">
      <Form.Item
        name="conversation_type"
        label={t("ankeai.conversations.type")}
      >
        <Select
          allowClear
          placeholder={t("common.select")}
          style={{ width: 200 }}
          options={[
            { label: "Chat", value: "chat" },
            { label: "Workflow", value: "workflow" },
          ]}
        />
      </Form.Item>

      <Col>
        <Form.Item className="m-0">
          <Flex align="center" gap={12} justify="end">
            <Button icon={<IconIcRoundRefresh />} onClick={reset}>
              {t("common.reset")}
            </Button>
            <Button
              ghost
              icon={<IconIcRoundSearch />}
              type="primary"
              onClick={search}
            >
              {t("common.search")}
            </Button>
          </Flex>
        </Form.Item>
      </Col>
    </Form>
  );
};

export default ConversationSearch;
