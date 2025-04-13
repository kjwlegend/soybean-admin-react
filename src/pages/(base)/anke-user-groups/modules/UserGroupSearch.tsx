import { Button, Col, Flex, Form, Input, Row, Select } from "antd";
import type { FC } from "react";

import { enableStatusOptions } from "@/constants/business";

const UserGroupSearch: FC<Page.SearchProps> = ({
  form,
  reset,
  search,
  searchParams,
}) => {
  const { t } = useTranslation();

  return (
    <Form form={form} layout="inline">
      <Form.Item name="name" label={t("ankeai.userGroups.name")}>
        <Input placeholder={t("ankeai.userGroups.name")} />
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

export default UserGroupSearch;
