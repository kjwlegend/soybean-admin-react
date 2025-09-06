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
        <Input placeholder={t("ankeai.form.name")} />
      </Form.Item>
      <Form.Item name="description" label={t("ankeai.agents.description")}>
        <Input placeholder={t("ankeai.form.description")} />
      </Form.Item>
      <Form.Item name="status" label={t("ankeai.agents.status")}>
        <Select
          allowClear
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
      <Form.Item name="agent_group_id" label={t("ankeai.agents.agentGroup")}>
        <Select
          allowClear
          placeholder={t("ankeai.form.selectAgentGroup")}
          style={{ width: 150 }}
        >
          {/* Agent group options would be loaded dynamically */}
        </Select>
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
