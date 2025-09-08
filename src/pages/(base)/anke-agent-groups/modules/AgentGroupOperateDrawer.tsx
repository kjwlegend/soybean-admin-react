import { Button, Drawer, Flex, Form, Input, InputNumber, Switch, Space, Select, message } from "antd";
import { useState, useEffect } from "react";
import type { FC } from "react";

import { useFormRules } from "@/features/form";
import { fetchProjectList, associateAgentGroupWithProject, dissociateAgentGroupFromProject, fetchAgentGroupProjects } from "@/service/api";
import { useTranslation } from "react-i18next";
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
  const [projects, setProjects] = useState<Api.AnkeAI.Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const { defaultRequiredRule } = useFormRules();

  const rules: Record<RuleKey, App.Global.FormRule[]> = {
    name: [defaultRequiredRule],
  };

  const handleClose = () => {
    onClose();
    setSelectedIcon("");
    setSelectedProjects([]);
    setProjects([]);
  };

  // Custom submit handler to handle project associations for new groups
  const customHandleSubmit = async () => {
    try {
      await handleSubmit();
      
      // If it's a new group and we have selected projects, associate them
      if (operateType === 'add' && selectedProjects.length > 0) {
        // The form should have the newly created group id after successful creation
        // We need to wait a bit and then refresh to get the association data
        setTimeout(() => {
          // The parent component should refresh the data
          onClose();
        }, 500);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    form.setFieldValue("icon", icon);
    setIconPickerVisible(false);
  };

  // Load projects data
  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await fetchProjectList({ page: 1, size: 1000 });
      setProjects(response.data.items);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Load associated projects for edit operation
  const loadAssociatedProjects = async (groupId: number) => {
    try {
      const response = await fetchAgentGroupProjects(groupId, { page: 1, size: 1000 });
      const associatedProjectIds = response.data.items.map(p => p.id);
      setSelectedProjects(associatedProjectIds);
    } catch (error) {
      console.error('Failed to load associated projects:', error);
    }
  };

  // Handle project selection changes
  const handleProjectsChange = async (newSelectedProjects: number[]) => {
    const groupId = form.getFieldValue('id');
    if (!groupId || operateType === 'add') {
      setSelectedProjects(newSelectedProjects);
      return;
    }

    // Handle project associations for existing group
    try {
      const currentProjects = new Set(selectedProjects);
      const newProjects = new Set(newSelectedProjects);

      // Projects to associate
      const toAssociate = newSelectedProjects.filter(id => !currentProjects.has(id));
      // Projects to dissociate
      const toDissociate = selectedProjects.filter(id => !newProjects.has(id));

      // Associate new projects
      for (const projectId of toAssociate) {
        await associateAgentGroupWithProject(groupId, projectId);
      }

      // Dissociate removed projects
      for (const projectId of toDissociate) {
        await dissociateAgentGroupFromProject(groupId, projectId);
      }

      setSelectedProjects(newSelectedProjects);
      message.success(t("ankeai.agentGroups.projectAssociationUpdated"));
    } catch (error) {
      console.error('Failed to update project associations:', error);
      message.error(t("ankeai.agentGroups.projectAssociationFailed"));
    }
  };

  // Set default values when drawer opens
  useEffect(() => {
    if (open) {
      if (operateType === "add") {
        form.setFieldsValue({
          sort_order: 0,
          is_active: true,
        });
        setSelectedIcon("");
        setSelectedProjects([]);
      } else {
        // Edit operation - load associated projects
        const groupId = form.getFieldValue('id');
        if (groupId) {
          loadAssociatedProjects(groupId);
        }
      }
      // Load projects for selection
      loadProjects();
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
              onClick={customHandleSubmit}
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

          <Form.Item 
            label={t("ankeai.agentGroups.associatedProjects")} 
            extra={t("ankeai.agentGroups.projectSelectionTip")}
          >
            <Select
              mode="multiple"
              placeholder={t("ankeai.agentGroups.selectProjects")}
              loading={loadingProjects}
              value={selectedProjects}
              onChange={handleProjectsChange}
              optionFilterProp="children"
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) =>
                option?.label?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
              }
              options={projects.map(project => ({
                label: project.title,
                value: project.id,
              }))}
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