import { Button, Drawer, Flex, Form, Input, Select, Avatar, Space } from "antd";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRequest } from "@sa/hooks";
import { fetchAgentList } from "@/service/api";
import LogoUploadModal from "./LogoUploadModal";

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
  const [logoModalOpen, setLogoModalOpen] = useState(false);

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

  // 处理logo选择
  const handleLogoSelect = (selectedUrl: string) => {
    // 处理返回的URL，确保格式正确
    let finalUrl = selectedUrl;
    
    // 如果是相对路径（以/storage开头），添加基础URL
    if (selectedUrl && selectedUrl.startsWith('/storage')) {
      const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : '';
      finalUrl = `${baseUrl}${selectedUrl}`;
    }
    
    setLogoUrl(finalUrl);
    form.setFieldValue("logo_url", finalUrl);
  };

  // 清除logo
  const handleClearLogo = () => {
    setLogoUrl("");
    form.setFieldValue("logo_url", "");
  };

  // 表单验证规则
  const rules: Record<RuleKey, App.Global.FormRule[]> = {
    name: [{ required: true, message: t("ankeai.userGroups.nameRequired") }],
  };

  // 监听表单数据变化，同步logo_url
  useEffect(() => {
    if (open) {
      // 延迟获取表单值，确保表单已经被填充
      setTimeout(() => {
        const formValues = form.getFieldsValue();
        const formLogoUrl = formValues.logo_url;
        console.log('Form values:', formValues);
        console.log('Logo URL from form:', formLogoUrl);
        setLogoUrl(formLogoUrl || "");
      }, 100);
    } else {
      // 关闭时清空logoUrl
      setLogoUrl("");
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
            <Space>
              <Button 
                icon={<EditOutlined />} 
                onClick={() => setLogoModalOpen(true)}
              >
                {logoUrl ? t("ankeai.userGroups.changeLogo") : t("ankeai.userGroups.selectLogo")}
              </Button>
              {logoUrl && (
                <Button 
                  icon={<DeleteOutlined />} 
                  danger
                  onClick={handleClearLogo}
                >
                  {t("ankeai.userGroups.clearLogo")}
                </Button>
              )}
            </Space>
            {logoUrl && (
              <div style={{ marginTop: 8 }}>
                <Avatar
                  src={logoUrl}
                  size={64}
                  shape="square"
                  alt="Group Logo Preview"
                />
                <div className="text-xs text-gray-500 mt-1 break-all" style={{ maxWidth: '300px' }}>
                  {logoUrl}
                </div>
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
      
      <LogoUploadModal
        open={logoModalOpen}
        currentLogoUrl={logoUrl}
        onClose={() => setLogoModalOpen(false)}
        onConfirm={(url) => {
          handleLogoSelect(url);
          setLogoModalOpen(false);
        }}
      />
    </Drawer>
  );
};

export default UserGroupOperateDrawer;
