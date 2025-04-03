import { Button, Col, Flex, Form, Input, Row, Select } from "antd";

import { enableStatusOptions, userGenderOptions } from "@/constants/business";
import { useFormRules } from "@/features/form";
import { translateOptions } from "@/utils/common";

const UserSearch: FC<Page.SearchProps> = memo(
  ({ form, reset, search, searchParams }) => {
    const { t } = useTranslation();
    const {
      patternRules: { email, phone },
    } = useFormRules();

    return (
      <Form
        form={form}
        initialValues={searchParams}
        labelCol={{
          md: 7,
          span: 5,
        }}
      >
        <Row wrap gutter={[16, 16]}>
          <Col lg={6} md={12} span={24}>
            <Form.Item
              className="m-0"
              label={t("page.manage.user.userName")}
              name="username"
            >
              <Input placeholder={t("page.manage.user.form.userName")} />
            </Form.Item>
          </Col>

          <Col lg={6} md={12} span={24}>
            <Form.Item
              className="m-0"
              label={t("page.manage.user.nickName")}
              name="nickname"
            >
              <Input placeholder={t("page.manage.user.form.nickName")} />
            </Form.Item>
          </Col>

          <Col lg={6} md={12} span={24}>
            <Form.Item
              className="m-0"
              label={t("page.manage.user.userPhone")}
              name="mobile"
              rules={[phone]}
            >
              <Input placeholder={t("page.manage.user.form.userPhone")} />
            </Form.Item>
          </Col>

          <Col lg={6} md={12} span={24}>
            <Form.Item
              className="m-0"
              label={t("page.manage.user.userEmail")}
              name="email"
              rules={[email]}
            >
              <Input placeholder={t("page.manage.user.form.userEmail")} />
            </Form.Item>
          </Col>

          <Col lg={6} md={12} span={24}>
            <Form.Item
              className="m-0"
              label={t("page.manage.user.userStatus")}
              name="is_active"
            >
              <Select
                allowClear
                options={translateOptions(enableStatusOptions).map(
                  (option) => ({
                    ...option,
                    value: option.value === "1",
                  }),
                )}
                placeholder={t("page.manage.user.form.userStatus")}
              />
            </Form.Item>
          </Col>

          <Col lg={12} span={24}>
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
        </Row>
      </Form>
    );
  },
);

export default UserSearch;
