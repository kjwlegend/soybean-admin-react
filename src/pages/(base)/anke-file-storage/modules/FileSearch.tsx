import { Button, Col, Flex, Form, Select } from "antd";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const FileSearch: FC<Page.SearchProps> = ({
  form,
  reset,
  search,
  searchParams,
}) => {
  const { t } = useTranslation();

  return (
    <Form form={form} initialValues={searchParams} layout="inline">
      <Form.Item name="access_level" label={t("ankeai.fileStorage.accessLevel")}>
        <Select 
          placeholder={t("ankeai.fileStorage.selectAccessLevel")} 
          allowClear
          style={{ width: 120 }}
        >
          <Select.Option value="private">{t("ankeai.fileStorage.private")}</Select.Option>
          <Select.Option value="project">{t("ankeai.fileStorage.projectLevel")}</Select.Option>
          <Select.Option value="public">{t("ankeai.fileStorage.public")}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="project_id" label={t("ankeai.fileStorage.project")}>
        <Select 
          placeholder={t("ankeai.fileStorage.selectProject")} 
          allowClear
          style={{ width: 150 }}
        >
          {/* Project options would be loaded dynamically */}
        </Select>
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

export default FileSearch;