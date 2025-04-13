import { Button, Col, Flex, Form, Input, Row, Select } from "antd";
import type { FC } from "react";

// 不需要enableStatusOptions，因为Agent状态是自定义的，不是通用的启用/禁用状态

const AgentSearch: FC<Page.SearchProps> = ({
  form,
  reset,
  search,
  searchParams,
}) => {
  const { t } = useTranslation();

  return (
    <Form form={form} initialValues={searchParams} layout="inline">
      <Form.Item name="name" label={t("ankeai.agents.name")}>
        <Input placeholder={t("ankeai.agents.form.name")} />
      </Form.Item>
      <Form.Item name="description" label={t("ankeai.agents.description")}>
        <Input placeholder={t("ankeai.agents.form.description")} />
      </Form.Item>
      <Form.Item name="status" label={t("ankeai.agents.status")}>
        <Select
          allowClear
          options={[
            { label: t("ankeai.agents.status.active"), value: "active" },
            {
              label: t("ankeai.agents.status.inactive"),
              value: "inactive",
            },
            { label: t("ankeai.agents.status.error"), value: "error" },
          ]}
          placeholder={t("ankeai.agents.form.status")}
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

export default AgentSearch;
