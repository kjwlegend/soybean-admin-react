import { Button, Col, Flex, Form, Input, Row, Select } from "antd";
import type { FC } from "react";
import { useFormRules } from "@/features/form";

import { enableStatusOptions } from "@/constants/business";

const UserSearch: FC<Page.SearchProps> = memo(
  ({ form, reset, search, searchParams }) => {
    const { t } = useTranslation();
    const {
      patternRules: { email, phone },
    } = useFormRules();

    return (
      <Form form={form} initialValues={searchParams} layout="inline">
        <Form.Item name="username" label={t("page.manage.user.userName")}>
          <Input placeholder={t("page.manage.user.form.userName")} />
        </Form.Item>
        <Form.Item name="nickname" label={t("page.manage.user.nickName")}>
          <Input placeholder={t("page.manage.user.form.nickName")} />
        </Form.Item>
        <Form.Item name="email" label={t("page.manage.user.userEmail")}>
          <Input placeholder={t("page.manage.user.form.userEmail")} />
        </Form.Item>
        <Form.Item name="mobile" label={t("page.manage.user.userPhone")}>
          <Input placeholder={t("page.manage.user.form.userPhone")} />
        </Form.Item>
        <Form.Item name="is_active" label={t("page.manage.user.userStatus")}>
          <Select
            allowClear
            options={enableStatusOptions.map((item) => ({
              label: t(item.label),
              value: item.value === "1",
            }))}
            placeholder={t("page.manage.user.form.userStatus")}
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
  },
);

export default UserSearch;
