import { Button, Col, Flex, Form, Input, Row } from "antd";
import type { FC } from "react";

import { useTranslation } from "react-i18next";

const ProjectSearch: FC<Page.SearchProps> = ({
  form,
  reset,
  search,
  searchParams,
}) => {
  const { t } = useTranslation();

  return (
    <Form form={form} initialValues={searchParams} layout="inline">
      <Form.Item name="title" label={t("ankeai.projects.title")}>
        <Input placeholder={t("ankeai.projects.searchTitle")} />
      </Form.Item>
      <Form.Item>
        <Flex gap={8}>
          <Button type="primary" onClick={search}>
            {t("common.search")}
          </Button>
          <Button onClick={reset}>{t("common.reset")}</Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default ProjectSearch;