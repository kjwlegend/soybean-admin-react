import { Button, Drawer, Flex, Form, Input, Select, Upload, Avatar, Space, message } from "antd";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import { useRequest } from "@sa/hooks";
import { fetchAgentList } from "@/service/api";
import { ankeUploadFile } from "@/service/api/anke-file-storage";

// 用户组模型定义
type UserGroupModel = {
  id?: number;
  name: string;
  description?: string;
  logo_url?: string;
  available_agents_ids?: number[];
};

// 必填字段类型
type RuleKey = Extract<keyof UserGroupModel, "name">;

const UserGroupOperateDrawer: FC<Page.OperateDrawerProps> = ({
  form,
  handleSubmit,
  onClose,
  open,
  operateType,
}) => {
  const { t } = useTranslation();
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // 获取可用的 agents 列表
  const { data: agents } = useRequest(
    () => fetchAgentList({ page: 1, size: 100 }),
    {
      manual: false,
    },
  );

  const agentOptions = agents
    ? agents.items.map((agent) => ({
        label: agent.name,
        value: agent.id,
      }))
    : [];

  // 处理logo上传
  const handleLogoUpload = async (file: any) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("access_level", "public");
      const response = await ankeUploadFile(formData);
      const uploadedUrl = response.data?.public_url || response.data?.download_url || "";
      if (!uploadedUrl) {
        throw new Error("Upload response missing URL");
      }
      setLogoUrl(uploadedUrl);
      form.setFieldValue("logo_url", uploadedUrl);
      message.success(t("ankeai.userGroups.logoUploadSuccess"));
    } catch (error) {
      console.error("Upload failed:", error);
      message.error(t("ankeai.userGroups.logoUploadFailed"));
    } finally {
      setUploading(false);
    }
    return false; // 阻止默认上传行为
  };

  // 表单验证规则
  const rules: Record<RuleKey, App.Global.FormRule[]> = {
    name: [{ required: true, message: t("ankeai.userGroups.nameRequired") }],
  };

  // 监听表单数据变化，同步logo_url
  useEffect(() => {
    if (open) {
      const formLogoUrl = form.getFieldValue("logo_url");
      setLogoUrl(formLogoUrl || "");
    }
  }, [open, form]);

  return (
    <Drawer
      open={open}
      title={
        operateType === "add"
          ? t("ankeai.userGroups.add")
          : t("ankeai.userGroups.edit")
      }
      footer={
        <Flex justify="space-between">
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button type="primary" onClick={handleSubmit}>
            {t("common.confirm")}
          </Button>
        </Flex>
      }
      onClose={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="id" hidden={operateType === "add"}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={t("ankeai.userGroups.name")}
          name="name"
          rules={rules.name}
        >
          <Input placeholder={t("ankeai.form.name")} />
        </Form.Item>

        <Form.Item
          label={t("ankeai.userGroups.description")}
          name="description"
        >
          <Input.TextArea placeholder={t("ankeai.form.description")} rows={4} />
        </Form.Item>

        <Form.Item
          label={t("ankeai.userGroups.logo")}
          name="logo_url"
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Upload
              name="file"
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleLogoUpload}
              disabled={uploading}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                {uploading ? t("ankeai.userGroups.uploading") : t("ankeai.userGroups.uploadLogo")}
              </Button>
            </Upload>
            {logoUrl && (
              <div style={{ marginTop: 8 }}>
                <Avatar
                  src={logoUrl}
                  size={64}
                  shape="square"
                  alt="Group Logo Preview"
                />
              </div>
            )}
          </Space>
        </Form.Item>

        <Form.Item label={t("ankeai.userGroups.agents")} name="agent_ids">
          <Select
            mode="multiple"
            allowClear
            options={agentOptions}
            placeholder={t("ankeai.form.agents")}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UserGroupOperateDrawer;
