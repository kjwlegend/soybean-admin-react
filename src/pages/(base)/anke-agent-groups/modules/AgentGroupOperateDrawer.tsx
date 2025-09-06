import { Button, Drawer, Flex, Form, Input, InputNumber, Switch, Space } from "antd";
import { useState, useEffect } from "react";
import type { FC } from "react";

import { useFormRules } from "@/features/form";
import IconPickerModal from "./IconPickerModal";

type Model = Api.AnkeAI.AgentGroupCreateParams & {
  id?: number;
  is_active?: boolean;
};

type RuleKey = Extract<keyof Model, "name">;

const AgentGroupOperateDrawer: FC<Page.OperateDrawerProps> = ({
  form,
  handleSubmit,
  onClose,
  open,
  operateType,
}) => {
  const { t } = useTranslation();
  const [iconPickerVisible, setIconPickerVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  const { defaultRequiredRule } = useFormRules();

  const rules: Record<RuleKey, App.Global.FormRule[]> = {
    name: [defaultRequiredRule],
  };

  const handleClose = () => {
    onClose();
    setSelectedIcon("");
  };

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    form.setFieldValue("icon", icon);
    setIconPickerVisible(false);
  };

  // Set default values when drawer opens for add operation
  useEffect(() => {
    if (open && operateType === "add") {
      form.setFieldsValue({
        sort_order: 0,
        is_active: true,
      });
      setSelectedIcon("");
    }
  }, [open, operateType, form]);

  return (
    <>
      <Drawer
        open={open}
        title={
          operateType === "add"
            ? t("ankeai.agentGroups.addGroup")
            : t("ankeai.agentGroups.editGroup")
        }
        footer={
          <Flex justify="space-between">
            <Button onClick={handleClose}>{t("common.cancel")}</Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
            >
              {t("common.confirm")}
            </Button>
          </Flex>
        }
        onClose={handleClose}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="ID" hidden={operateType === "add"}>
            <Input disabled />
          </Form.Item>

          <Form.Item
            label={t("ankeai.agentGroups.name")}
            name="name"
            rules={rules.name}
          >
            <Input placeholder={t("ankeai.agentGroups.enterName")} />
          </Form.Item>

          <Form.Item 
            label={t("ankeai.agentGroups.description")} 
            name="description"
          >
            <Input.TextArea 
              placeholder={t("ankeai.agentGroups.enterDescription")} 
              rows={4} 
            />
          </Form.Item>

          <Form.Item 
            label={t("ankeai.agentGroups.icon")} 
            name="icon"
          >
            <Space.Compact style={{ width: '100%' }}>
              <Input 
                placeholder={t("ankeai.agentGroups.selectIcon")}
                readOnly
                value={selectedIcon}
                addonBefore={
                  selectedIcon ? (
                    <i className={selectedIcon} style={{ fontSize: '16px' }} />
                  ) : (
                    <span>Icon</span>
                  )
                }
              />
              <Button 
                type="primary"
                onClick={() => setIconPickerVisible(true)}
              >
                {t("ankeai.agentGroups.chooseIcon")}
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item 
            label={t("ankeai.agentGroups.sortOrder")} 
            name="sort_order"
            extra={t("ankeai.agentGroups.sortOrderTip")}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }}
              placeholder={t("ankeai.agentGroups.enterSortOrder")}
            />
          </Form.Item>

          <Form.Item 
            label={t("common.status")} 
            name="is_active"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren={t("common.active")}
              unCheckedChildren={t("common.inactive")}
            />
          </Form.Item>
        </Form>
      </Drawer>
      
      <IconPickerModal
        visible={iconPickerVisible}
        onCancel={() => setIconPickerVisible(false)}
        onSelect={handleIconSelect}
        selectedIcon={selectedIcon}
      />
    </>
  );
};

export default AgentGroupOperateDrawer;