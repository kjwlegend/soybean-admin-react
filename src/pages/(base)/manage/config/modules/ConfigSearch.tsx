import { Button, Form, Input, Select, Space } from "antd";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { enableStatusOptions } from "@/constants/business";
import { translateOptions } from "@/utils/common";

const AButton = Button;
const ASpace = Space;

const ConfigSearch: FC<Page.SearchProps> = memo(
  ({ form, reset, search, searchParams }) => {
    const { t } = useTranslation();

    return (
      <Form
        form={form}
        initialValues={searchParams}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={search}
      >
        <div className="grid grid-cols-2 gap-x-16px gap-y-0 lt-sm:grid-cols-1">
          <Form.Item label={t("page.manage.config.key")} name="key">
            <Input allowClear placeholder={t("page.manage.config.form.key")} />
          </Form.Item>
          <Form.Item label={t("page.manage.config.value")} name="value">
            <Input
              allowClear
              placeholder={t("page.manage.config.form.value")}
            />
          </Form.Item>
          <Form.Item label={t("page.manage.config.status")} name="status">
            <Select
              allowClear
              options={translateOptions(enableStatusOptions)}
              placeholder={t("page.manage.config.form.status")}
            />
          </Form.Item>
        </div>
        <div className="flex-center">
          <ASpace>
            <AButton onClick={reset}>{t("common.reset")}</AButton>
            <AButton htmlType="submit" type="primary">
              {t("common.search")}
            </AButton>
          </ASpace>
        </div>
      </Form>
    );
  },
);

export default ConfigSearch;
