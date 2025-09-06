import { useState, useEffect } from "react";
import { 
  Modal, 
  Table, 
  Button, 
  Select, 
  message, 
  Space, 
  Tag,
  Popconfirm,
  Form,
  Row,
  Col,
} from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import type { FC } from "react";

import { useRequest } from "@sa/hooks";
import { useTranslation } from "react-i18next";
import {
  fetchProjectMembers,
  addProjectMember,
  removeProjectMember,
  updateProjectMember,
  fetchUserList,
} from "@/service/api";

interface Props {
  visible: boolean;
  projectId?: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const UserAssignmentModal: FC<Props> = ({
  visible,
  projectId,
  onCancel,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { data: members, run: refreshMembers } = useRequest(
    () => fetchProjectMembers(projectId!),
    {
      manual: true,
    }
  );

  const { data: users } = useRequest(
    () => fetchUserList({ page: 1, size: 100 }),
    {
      manual: false,
    }
  );

  useEffect(() => {
    if (visible && projectId) {
      refreshMembers();
    }
  }, [visible, projectId]);

  const handleAddMember = async (values: { user_id: number; role: "admin" | "member" }) => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      await addProjectMember(projectId, values);
      message.success(t("ankeai.projects.memberAddSuccess"));
      refreshMembers();
      form.resetFields();
    } catch (error) {
      message.error(t("ankeai.projects.memberAddFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (membershipId: number) => {
    if (!projectId) return;

    setLoading(true);
    try {
      await removeProjectMember(projectId, membershipId);
      message.success(t("ankeai.projects.memberRemoveSuccess"));
      refreshMembers();
    } catch (error) {
      message.error(t("ankeai.projects.memberRemoveFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMemberRole = async (membershipId: number, role: string) => {
    if (!projectId) return;

    setLoading(true);
    try {
      await updateProjectMember(projectId, membershipId, { role: role as "admin" | "member" });
      message.success(t("ankeai.projects.memberUpdateSuccess"));
      refreshMembers();
    } catch (error) {
      message.error(t("ankeai.projects.memberUpdateFailed"));
    } finally {
      setLoading(false);
    }
  };

  const availableUsers = users?.items.filter(
    user => !members?.items.some(member => member.user.id === user.id)
  ) || [];

  const columns = [
    {
      title: t("ankeai.projects.memberName"),
      dataIndex: ["user", "username"],
      key: "username",
      render: (username: string, record: Api.AnkeAI.ProjectMembership) => (
        <Space>
          <UserOutlined />
          {username}
          {record.user.email && <span className="text-gray-500">({record.user.email})</span>}
        </Space>
      ),
    },
    {
      title: t("ankeai.projects.memberRole"),
      dataIndex: "role",
      key: "role",
      render: (role: string, record: Api.AnkeAI.ProjectMembership) => (
        <Select
          value={role}
          style={{ width: 100 }}
          onChange={(value) => handleUpdateMemberRole(record.id, value)}
          disabled={loading}
        >
          <Select.Option value="member">
            <Tag color="blue">{t("ankeai.projects.roleMember")}</Tag>
          </Select.Option>
          <Select.Option value="admin">
            <Tag color="red">{t("ankeai.projects.roleAdmin")}</Tag>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: t("ankeai.projects.joinedAt"),
      dataIndex: "joined_at",
      key: "joined_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t("ankeai.projects.addedBy"),
      dataIndex: ["added_by", "username"],
      key: "added_by",
    },
    {
      title: t("common.operation"),
      key: "action",
      render: (_: any, record: Api.AnkeAI.ProjectMembership) => (
        <Popconfirm
          title={t("ankeai.projects.confirmRemoveMember")}
          onConfirm={() => handleRemoveMember(record.id)}
          disabled={loading}
        >
          <Button danger size="small" disabled={loading}>
            {t("common.remove")}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      title={t("ankeai.projects.manageMembers")}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          {t("common.close")}
        </Button>,
      ]}
      width={800}
    >
      <div className="space-y-4">
        {/* Add Member Form */}
        <Form
          form={form}
          layout="inline"
          onFinish={handleAddMember}
          className="mb-4 p-4 bg-gray-50 rounded"
        >
          <Form.Item
            name="user_id"
            label={t("ankeai.projects.selectUser")}
            rules={[{ required: true, message: t("ankeai.projects.selectUserRequired") }]}
          >
            <Select
              placeholder={t("ankeai.projects.selectUserPlaceholder")}
              style={{ width: 200 }}
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false
              }
              options={availableUsers.map(user => ({
                value: user.id,
                label: `${user.username} ${user.email ? `(${user.email})` : ''}`,
              }))}
            />
          </Form.Item>
          
          <Form.Item
            name="role"
            label={t("ankeai.projects.selectRole")}
            initialValue="member"
            rules={[{ required: true }]}
          >
            <Select style={{ width: 120 }}>
              <Select.Option value="member">{t("ankeai.projects.roleMember")}</Select.Option>
              <Select.Option value="admin">{t("ankeai.projects.roleAdmin")}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<PlusOutlined />}
              loading={loading}
              disabled={availableUsers.length === 0}
            >
              {t("ankeai.projects.addMember")}
            </Button>
          </Form.Item>
        </Form>

        {/* Members Table */}
        <Table
          columns={columns}
          dataSource={members?.items || []}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
          locale={{
            emptyText: t("ankeai.projects.noMembers"),
          }}
        />
      </div>
    </Modal>
  );
};

export default UserAssignmentModal;