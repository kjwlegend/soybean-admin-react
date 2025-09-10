import { FC, useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  Input,
  Upload,
  Button,
  message,
  List,
  Avatar,
  Space,
  Spin,
  Empty,
} from "antd";
import {
  UploadOutlined,
  LinkOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { ankeUploadFile, fetchImageFileList } from "@/service/api";

interface LogoUploadModalProps {
  open: boolean;
  currentLogoUrl?: string;
  onClose: () => void;
  onConfirm: (logoUrl: string) => void;
}

const LogoUploadModal: FC<LogoUploadModalProps> = ({
  open,
  currentLogoUrl,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("url");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageList, setImageList] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 12,
    total: 0,
  });

  // 加载图片列表
  const loadImageList = async (page = 1) => {
    try {
      setLoadingImages(true);
      const response = await fetchImageFileList({
        page,
        size: pagination.size,
      });
      if (response.data) {
        setImageList(response.data.items || []);
        setPagination({
          ...pagination,
          page,
          total: response.data.total || 0,
        });
      }
    } catch (error) {
      console.error("Failed to load images:", error);
      message.error(t("ankeai.userGroups.loadImagesFailed"));
    } finally {
      setLoadingImages(false);
    }
  };

  // 在打开模态框时加载图片
  useEffect(() => {
    if (open) {
      // 重置状态
      setUrlInput(currentLogoUrl || "");
      setSelectedImage(currentLogoUrl || "");
      setActiveTab("url");
      
      // 加载图片列表
      loadImageList(1);
    }
  }, [open, currentLogoUrl]);

  // 处理URL输入确认
  const handleUrlConfirm = () => {
    if (!urlInput) {
      message.error(t("ankeai.userGroups.pleaseEnterUrl"));
      return;
    }
    
    // 验证URL格式
    try {
      new URL(urlInput);
      onConfirm(urlInput);
      onClose();
    } catch {
      message.error(t("ankeai.userGroups.invalidUrl"));
    }
  };

  // 处理文件上传
  const handleFileUpload = async (file: any) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("access_level", "public");
      
      const response = await ankeUploadFile(formData);
      
      if (response.data) {
        // 使用file_path（真实的静态文件URL）
        const logoUrl = response.data.file_path || "";
        
        if (logoUrl) {
          message.success(t("ankeai.userGroups.uploadSuccess"));
          onConfirm(logoUrl);
          onClose();
        } else {
          throw new Error("No URL returned from upload");
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      message.error(t("ankeai.userGroups.uploadFailed"));
    } finally {
      setUploading(false);
    }
    return false; // 阻止默认上传
  };

  // 处理从列表选择图片
  const handleSelectFromList = () => {
    if (!selectedImage) {
      message.error(t("ankeai.userGroups.pleaseSelectImage"));
      return;
    }
    onConfirm(selectedImage);
    onClose();
  };

  // 获取当前tab的确认按钮处理函数
  const getConfirmHandler = () => {
    switch (activeTab) {
      case "url":
        return handleUrlConfirm;
      case "select":
        return handleSelectFromList;
      default:
        return () => {};
    }
  };

  // 判断确认按钮是否禁用
  const isConfirmDisabled = () => {
    switch (activeTab) {
      case "url":
        return !urlInput;
      case "select":
        return !selectedImage;
      case "upload":
        return true; // 上传模式不需要确认按钮
      default:
        return true;
    }
  };

  const tabItems = [
    {
      key: "url",
      label: (
        <Space>
          <LinkOutlined />
          {t("ankeai.userGroups.inputUrl")}
        </Space>
      ),
      children: (
        <div className="p-4">
          <Input
            placeholder={t("ankeai.userGroups.enterImageUrl")}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onPressEnter={handleUrlConfirm}
            prefix={<LinkOutlined />}
            size="large"
          />
          {urlInput && (
            <div className="mt-4 flex justify-center">
              <Avatar
                src={urlInput}
                size={80}
                shape="square"
                alt="URL Preview"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "select",
      label: (
        <Space>
          <FileImageOutlined />
          {t("ankeai.userGroups.selectFromStorage")}
        </Space>
      ),
      children: (
        <div className="p-2">
          <Spin spinning={loadingImages}>
            {imageList.length > 0 ? (
              <>
                <List
                  grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 4, xl: 4 }}
                  dataSource={imageList}
                  renderItem={(item) => (
                    <List.Item>
                      <div
                        className={`cursor-pointer border-2 rounded-lg p-2 transition-all ${
                          selectedImage === item.file_path
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        onClick={() =>
                          setSelectedImage(item.file_path)
                        }
                      >
                        <Avatar
                          src={(() => {
                            const url = item.file_path;
                            if (url && url.startsWith('/storage')) {
                              const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : '';
                              return `${baseUrl}${url}`;
                            }
                            return url;
                          })()}
                          size={64}
                          shape="square"
                          className="w-full"
                        />
                        <div className="text-xs mt-1 text-center truncate">
                          {item.original_name}
                        </div>
                      </div>
                    </List.Item>
                  )}
                  pagination={{
                    current: pagination.page,
                    pageSize: pagination.size,
                    total: pagination.total,
                    onChange: (page) => loadImageList(page),
                    showSizeChanger: false,
                    size: "small",
                  }}
                />
              </>
            ) : (
              <Empty
                description={t("ankeai.userGroups.noImagesFound")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Spin>
        </div>
      ),
    },
    {
      key: "upload",
      label: (
        <Space>
          <UploadOutlined />
          {t("ankeai.userGroups.uploadNew")}
        </Space>
      ),
      children: (
        <div className="p-4 text-center">
          <Upload
            name="file"
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleFileUpload}
            disabled={uploading}
          >
            <Button
              icon={<UploadOutlined />}
              loading={uploading}
              size="large"
              type="primary"
            >
              {uploading
                ? t("ankeai.userGroups.uploading")
                : t("ankeai.userGroups.selectAndUpload")}
            </Button>
          </Upload>
          <div className="mt-2 text-gray-500 text-sm">
            {t("ankeai.userGroups.uploadTip")}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={t("ankeai.userGroups.selectLogo")}
      open={open}
      onCancel={onClose}
      onOk={getConfirmHandler()}
      okButtonProps={{
        disabled: isConfirmDisabled(),
        style: { display: activeTab === "upload" ? "none" : undefined },
      }}
      cancelText={t("common.cancel")}
      okText={t("common.confirm")}
      width={600}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </Modal>
  );
};

export default LogoUploadModal;