import { useState } from "react";
import { Modal, Input, Row, Col, Button, Tabs, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { FC } from "react";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSelect: (icon: string) => void;
  selectedIcon?: string;
}

// FontAwesome icon collections
const FONTAWESOME_ICONS = {
  solid: [
    'fas fa-robot', 'fas fa-user', 'fas fa-users', 'fas fa-cog', 'fas fa-home',
    'fas fa-star', 'fas fa-heart', 'fas fa-bolt', 'fas fa-fire', 'fas fa-magic',
    'fas fa-rocket', 'fas fa-shield', 'fas fa-crown', 'fas fa-gem', 'fas fa-trophy',
    'fas fa-medal', 'fas fa-award', 'fas fa-flag', 'fas fa-bookmark', 'fas fa-tag',
    'fas fa-tags', 'fas fa-folder', 'fas fa-file', 'fas fa-image', 'fas fa-camera',
    'fas fa-video', 'fas fa-music', 'fas fa-headphones', 'fas fa-microphone',
    'fas fa-phone', 'fas fa-envelope', 'fas fa-comment', 'fas fa-comments',
    'fas fa-bell', 'fas fa-calendar', 'fas fa-clock', 'fas fa-map', 'fas fa-globe',
    'fas fa-search', 'fas fa-filter', 'fas fa-sort', 'fas fa-plus', 'fas fa-minus',
    'fas fa-times', 'fas fa-check', 'fas fa-arrow-up', 'fas fa-arrow-down',
    'fas fa-arrow-left', 'fas fa-arrow-right', 'fas fa-chevron-up', 'fas fa-chevron-down'
  ],
  regular: [
    'far fa-user', 'far fa-star', 'far fa-heart', 'far fa-bookmark', 'far fa-flag',
    'far fa-folder', 'far fa-file', 'far fa-image', 'far fa-envelope', 'far fa-comment',
    'far fa-comments', 'far fa-bell', 'far fa-calendar', 'far fa-clock', 'far fa-map',
    'far fa-circle', 'far fa-square', 'far fa-check-circle', 'far fa-times-circle',
    'far fa-question-circle', 'far fa-info-circle', 'far fa-exclamation-circle',
    'far fa-lightbulb', 'far fa-gem', 'far fa-building', 'far fa-hospital',
    'far fa-smile', 'far fa-frown', 'far fa-meh', 'far fa-thumbs-up', 'far fa-thumbs-down'
  ],
  brands: [
    'fab fa-github', 'fab fa-google', 'fab fa-twitter', 'fab fa-facebook',
    'fab fa-linkedin', 'fab fa-instagram', 'fab fa-youtube', 'fab fa-discord',
    'fab fa-slack', 'fab fa-microsoft', 'fab fa-apple', 'fab fa-android',
    'fab fa-chrome', 'fab fa-firefox', 'fab fa-safari', 'fab fa-edge',
    'fab fa-npm', 'fab fa-node-js', 'fab fa-react', 'fab fa-vue',
    'fab fa-angular', 'fab fa-python', 'fab fa-java', 'fab fa-docker'
  ]
};

const IconPickerModal: FC<Props> = ({ visible, onCancel, onSelect, selectedIcon }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("solid");

  const filterIcons = (icons: string[], search: string) => {
    if (!search) return icons;
    return icons.filter(icon => 
      icon.toLowerCase().includes(search.toLowerCase())
    );
  };

  const renderIconGrid = (icons: string[]) => {
    const filteredIcons = filterIcons(icons, searchTerm);

    if (filteredIcons.length === 0) {
      return (
        <Empty
          description={t("ankeai.agentGroups.noIconsFound")}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <Row gutter={[8, 8]} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filteredIcons.map(icon => (
          <Col span={3} key={icon}>
            <Button
              type={selectedIcon === icon ? "primary" : "default"}
              size="large"
              style={{
                width: '100%',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                fontSize: '20px',
                border: selectedIcon === icon ? '2px solid #1890ff' : '1px solid #d9d9d9'
              }}
              onClick={() => onSelect(icon)}
            >
              <i className={icon} />
              <div style={{ fontSize: '8px', marginTop: '4px' }}>
                {icon.split(' ')[1]?.replace('fa-', '')}
              </div>
            </Button>
          </Col>
        ))}
      </Row>
    );
  };

  const tabItems = [
    {
      key: 'solid',
      label: t("ankeai.agentGroups.solidIcons"),
      children: renderIconGrid(FONTAWESOME_ICONS.solid),
    },
    {
      key: 'regular',
      label: t("ankeai.agentGroups.regularIcons"),
      children: renderIconGrid(FONTAWESOME_ICONS.regular),
    },
    {
      key: 'brands',
      label: t("ankeai.agentGroups.brandIcons"),
      children: renderIconGrid(FONTAWESOME_ICONS.brands),
    },
  ];

  const handleReset = () => {
    setSearchTerm("");
    setActiveTab("solid");
  };

  return (
    <Modal
      title={t("ankeai.agentGroups.selectIcon")}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="clear" onClick={() => onSelect("")}>
          {t("ankeai.agentGroups.clearIcon")}
        </Button>,
        <Button key="reset" onClick={handleReset}>
          {t("common.reset")}
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          {t("common.cancel")}
        </Button>,
      ]}
      width={800}
      style={{ top: 20 }}
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder={t("ankeai.agentGroups.searchIcons")}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </div>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </Modal>
  );
};

export default IconPickerModal;