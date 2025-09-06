import { useState, useEffect } from "react";
import { Modal, Button, List, message } from "antd";
import { DragOutlined, HolderOutlined } from "@ant-design/icons";
import type { FC } from "react";

import { reorderAgentGroups } from "@/service/api";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  groups: Api.AnkeAI.AgentGroup[];
}

interface SortableGroup {
  id: number;
  name: string;
  icon?: string;
  sort_order: number;
}

const GroupSortModal: FC<Props> = ({ visible, onCancel, onSuccess, groups }) => {
  const { t } = useTranslation();
  const [sortableGroups, setSortableGroups] = useState<SortableGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (visible && groups) {
      const sorted = [...groups]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(group => ({
          id: group.id,
          name: group.name,
          icon: group.icon,
          sort_order: group.sort_order,
        }));
      setSortableGroups(sorted);
    }
  }, [visible, groups]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/html"), 10);
    
    if (dragIndex === dropIndex) return;

    const newGroups = [...sortableGroups];
    const draggedGroup = newGroups[dragIndex];
    
    // Remove from original position
    newGroups.splice(dragIndex, 1);
    // Insert at new position
    newGroups.splice(dropIndex, 0, draggedGroup);
    
    // Update sort_order
    const updatedGroups = newGroups.map((group, index) => ({
      ...group,
      sort_order: index,
    }));
    
    setSortableGroups(updatedGroups);
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const reorderData = {
        group_orders: sortableGroups.map((group, index) => ({
          id: group.id,
          sort_order: index,
        })),
      };

      await reorderAgentGroups(reorderData);
      message.success(t("ankeai.agentGroups.reorderSuccess"));
      onSuccess();
    } catch (error) {
      message.error(t("ankeai.agentGroups.reorderFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (groups) {
      const sorted = [...groups]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(group => ({
          id: group.id,
          name: group.name,
          icon: group.icon,
          sort_order: group.sort_order,
        }));
      setSortableGroups(sorted);
    }
  };

  return (
    <Modal
      title={t("ankeai.agentGroups.reorderGroups")}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="reset" onClick={handleReset} disabled={loading}>
          {t("common.reset")}
        </Button>,
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          {t("common.cancel")}
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={loading}>
          {t("common.save")}
        </Button>,
      ]}
      width={600}
    >
      <div className="mb-4">
        <p className="text-gray-600">
          {t("ankeai.agentGroups.dragToReorder")}
        </p>
      </div>
      
      <List
        bordered
        dataSource={sortableGroups}
        renderItem={(item, index) => (
          <List.Item
            style={{
              padding: '12px 16px',
              cursor: 'grab',
              backgroundColor: draggedIndex === index ? '#f0f0f0' : 'white',
              border: draggedIndex === index ? '2px dashed #1890ff' : '1px solid #d9d9d9',
              userSelect: 'none',
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="flex items-center space-x-3 w-full">
              <HolderOutlined className="text-gray-400" />
              <div className="flex items-center space-x-2 flex-1">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                  #{index}
                </span>
                {item.icon && (
                  <i className={item.icon} style={{ fontSize: '16px' }} />
                )}
                <span className="font-medium">{item.name}</span>
              </div>
            </div>
          </List.Item>
        )}
        style={{ maxHeight: '400px', overflowY: 'auto' }}
      />
    </Modal>
  );
};

export default GroupSortModal;