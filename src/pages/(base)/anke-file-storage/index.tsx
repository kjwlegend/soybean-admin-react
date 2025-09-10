import { Suspense, lazy, useState } from "react";
import dayjs from "dayjs";

import {
  TableHeaderOperation,
  useTable,
  useTableOperate,
  useTableScroll,
} from "@/features/table";
import {
  fetchFileList,
  ankeDeleteFile,
  ankeDownloadFile,
} from "@/service/api";
import { useTranslation } from "react-i18next";
import { useMobile } from "@/hooks/common/mobile";
import {
  getFileType,
  getFileTypeLabel,
  getFileTypeIcon,
  getFileTypeColor,
  generatePublicUrl,
} from "@/utils/file";
import { localStg } from "@/utils/storage";
import { getServiceBaseURL } from "@/utils/service";

import { 
  message, 
  Button as AButton, 
  Card as ACard, 
  Collapse as ACollapse, 
  Popconfirm as APopconfirm, 
  Table as ATable, 
  Tag,
  Modal,
  Tooltip,
  Space,
} from "antd";
import { 
  UploadOutlined, 
  DownloadOutlined, 
  FileOutlined, 
  EyeOutlined, 
  LinkOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const FileSearch = lazy(() => import("./modules/FileSearch"));
const FileUploadModal = lazy(() => import("./modules/FileUploadModal"));

const AnkeFileStorageManage = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } =
    useTable(
      {
        apiFn: fetchFileList,
        apiParams: {
          page: 1,
          size: 10,
        },
        columns: () => [
          {
            align: "center",
            dataIndex: "index",
            key: "index",
            title: t("common.index"),
            width: 64,
          },
          {
            align: "center",
            dataIndex: "original_name",
            key: "original_name",
            minWidth: 200,
            title: t("ankeai.fileStorage.fileName"),
            render: (value: string, record: Api.AnkeAI.FileStorage) => {
              const fileType = getFileType(record.mime_type, value);
              return (
                <div className="flex items-center space-x-2">
                  <Tag color={getFileTypeColor(fileType)}>
                    <i className={`anticon anticon-${getFileTypeIcon(fileType)}`} />
                    {getFileTypeLabel(fileType)}
                  </Tag>
                  <Tooltip title={value}>
                    <span className="truncate max-w-xs">{value}</span>
                  </Tooltip>
                </div>
              );
            },
          },
          {
            align: "center",
            dataIndex: "file_size_mb",
            key: "file_size_mb",
            minWidth: 100,
            title: t("ankeai.fileStorage.fileSize"),
            render: (value: number) => `${value?.toFixed(2) || 0} MB`,
          },
          {
            align: "center",
            dataIndex: "mime_type",
            key: "file_type",
            minWidth: 120,
            title: t("ankeai.fileStorage.fileType"),
            render: (mimeType: string, record: Api.AnkeAI.FileStorage) => {
              const fileType = getFileType(mimeType, record.original_name);
              return (
                <Tag color={getFileTypeColor(fileType)}>
                  {getFileTypeLabel(fileType)}
                </Tag>
              );
            },
          },
          {
            align: "center",
            dataIndex: "access_level",
            key: "access_level",
            minWidth: 100,
            title: t("ankeai.fileStorage.accessLevel"),
            render: (value: string) => (
              <Tag color={value === 'private' ? 'red' : value === 'project' ? 'blue' : 'green'}>
                {t(`ankeai.fileStorage.${value === 'project' ? 'projectLevel' : value}`)}
              </Tag>
            ),
          },
          {
            align: "center",
            dataIndex: "upload_date",
            key: "upload_date",
            minWidth: 160,
            title: t("ankeai.fileStorage.uploadDate"),
            render: (value: string) =>
              dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            align: "center",
            key: "operate",
            render: (_, record: Api.AnkeAI.FileStorage) => (
              <Space size="small">
                <Tooltip title={t("ankeai.fileStorage.download")}>
                  <AButton
                    icon={<DownloadOutlined />}
                    size="small"
                    type="primary"
                    ghost
                    onClick={() => handleDownload(record)}
                  />
                </Tooltip>
                {record.access_level === 'public' && (
                  <Tooltip title={t("ankeai.fileStorage.copyPublicUrl")}>
                    <AButton
                      icon={<LinkOutlined />}
                      size="small"
                      onClick={() => handleCopyPublicUrl(record)}
                    />
                  </Tooltip>
                )}
                <Tooltip title={t("ankeai.fileStorage.viewDetails")}>
                  <AButton
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => handleViewDetails(record)}
                  />
                </Tooltip>
                <APopconfirm
                  title={t("common.confirmDelete")}
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Tooltip title={t("common.delete")}>
                    <AButton danger size="small" icon={<DeleteOutlined />} />
                  </Tooltip>
                </APopconfirm>
              </Space>
            ),
            title: t("common.operate"),
            width: 200,
          },
        ],
      },
      { showQuickJumper: true },
    );

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Api.AnkeAI.FileStorage | null>(null);

  const {
    checkedRowKeys,
    generalPopupOperation,
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    rowSelection,
  } = useTableOperate(data, run, async (res, type) => {
    // File storage doesn't support add/edit operations
  });

  async function handleDelete(id: number) {
    try {
      await ankeDeleteFile(id);
      message.success(t("common.deleteSuccess"));
      onDeleted();
    } catch (error) {
      message.error(t("common.deleteFailed"));
    }
  }

  async function handleBatchDelete() {
    await Promise.all(checkedRowKeys.map((id) => ankeDeleteFile(Number(id))));
    onBatchDeleted();
  }

  const handleDownload = async (record: Api.AnkeAI.FileStorage) => {
    try {
      // 直接使用浏览器的下载能力，避免响应转换问题
      const token = localStg.get('token');
      if (!token) {
        message.error(t("ankeai.fileStorage.pleaseLogin"));
        return;
      }

      // 获取正确的 API base URL
      const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === "Y";
      const { otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);
      const downloadUrl = `${otherBaseURL.app}/files/${record.id}/download`;
      
      console.log('Download URL:', downloadUrl);
      console.log('otherBaseURL.app:', otherBaseURL.app);
      
      // 创建一个隐藏的 a 标签来触发下载
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = record.original_name;
      
      // 添加认证头 - 通过临时 iframe 或者 fetch 方式
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Download response status:', response.status);
      console.log('Download response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        // 如果是错误响应，尝试读取错误内容
        const errorText = await response.text();
        console.error('Download error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 200)}`);
      }
      
      const blob = await response.blob();
      console.log('Downloaded blob size:', blob.size, 'bytes, type:', blob.type);
      
      // 如果blob太小，可能是错误响应
      if (blob.size < 1000) {
        const text = await blob.text();
        console.warn('Small blob content:', text);
        // 检查是否是JSON错误响应
        try {
          const json = JSON.parse(text);
          if (json.detail || json.error) {
            throw new Error(`Server error: ${json.detail || json.error}`);
          }
        } catch (e) {
          // 不是JSON，可能是HTML错误页面或其他内容
          if (text.includes('<!DOCTYPE') || text.includes('<html')) {
            throw new Error('Received HTML error page instead of file content');
          }
        }
      }
      
      const url = window.URL.createObjectURL(blob);
      
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success(t("ankeai.fileStorage.downloadSuccess"));
    } catch (error) {
      console.error('Download failed:', error);
      message.error(t("ankeai.fileStorage.downloadFailed"));
    }
  };

  const handleCopyPublicUrl = async (record: Api.AnkeAI.FileStorage) => {
    // 使用file_path字段生成公开访问URL
    const publicUrl = record.file_path 
      ? generatePublicUrl(record.file_path, record.access_level, true)
      : generatePublicUrl(record.id, record.access_level, false);
    if (publicUrl) {
      try {
        await navigator.clipboard.writeText(publicUrl);
        message.success(t("ankeai.fileStorage.urlCopied"));
      } catch (error) {
        // 后备方案
        const textArea = document.createElement('textarea');
        textArea.value = publicUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        message.success(t("ankeai.fileStorage.urlCopied"));
      }
    }
  };

  const handleViewDetails = (record: Api.AnkeAI.FileStorage) => {
    setSelectedFile(record);
    setDetailModalOpen(true);
  };

  const handleUpload = () => {
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = () => {
    run(); // 刷新列表
  };

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : "1"}
        items={[
          {
            children: <FileSearch {...searchProps} />,
            key: "1",
            label: t("common.search"),
          },
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t("ankeai.fileStorage.title")}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleUpload}
            columns={columnChecks}
            disabledDelete={checkedRowKeys.length === 0}
            loading={tableProps.loading}
            refresh={run}
            setColumnChecks={setColumnChecks}
            onDelete={handleBatchDelete}
          />
        }
      >
        <ATable
          rowSelection={rowSelection}
          scroll={scrollConfig}
          size="small"
          {...tableProps}
        />
      </ACard>

      {/* 文件上传对话框 */}
      <Suspense>
        <FileUploadModal
          open={uploadModalOpen}
          onCancel={() => setUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      </Suspense>

      {/* 文件详情对话框 */}
      <Modal
        title={t("ankeai.fileStorage.fileDetails")}
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <AButton key="close" onClick={() => setDetailModalOpen(false)}>
            {t("common.close")}
          </AButton>,
        ]}
        width={800}
      >
        {selectedFile && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>{t("ankeai.fileStorage.fileName")}:</strong>
                <p>{selectedFile.original_name}</p>
              </div>
              <div>
                <strong>{t("ankeai.fileStorage.fileSize")}:</strong>
                <p>{selectedFile.file_size_mb?.toFixed(2)} MB</p>
              </div>
              <div>
                <strong>{t("ankeai.fileStorage.fileType")}:</strong>
                <p>
                  <Tag color={getFileTypeColor(getFileType(selectedFile.mime_type, selectedFile.original_name))}>
                    {getFileTypeLabel(getFileType(selectedFile.mime_type, selectedFile.original_name))}
                  </Tag>
                </p>
              </div>
              <div>
                <strong>{t("ankeai.fileStorage.accessLevel")}:</strong>
                <p>
                  <Tag color={selectedFile.access_level === 'private' ? 'red' : selectedFile.access_level === 'project' ? 'blue' : 'green'}>
                    {t(`ankeai.fileStorage.${selectedFile.access_level === 'project' ? 'projectLevel' : selectedFile.access_level}`)}
                  </Tag>
                </p>
              </div>
              <div>
                <strong>{t("ankeai.fileStorage.uploadDate")}:</strong>
                <p>{dayjs(selectedFile.upload_date).format("YYYY-MM-DD HH:mm:ss")}</p>
              </div>
              <div>
                <strong>{t("ankeai.fileStorage.downloadCount")}:</strong>
                <p>{selectedFile.download_count} {t("ankeai.fileStorage.times")}</p>
              </div>
              {selectedFile.user && (
                <div>
                  <strong>{t("ankeai.fileStorage.uploadedBy")}:</strong>
                  <p>{selectedFile.user.username}</p>
                </div>
              )}
              {selectedFile.project && (
                <div>
                  <strong>{t("ankeai.fileStorage.project")}:</strong>
                  <p>{selectedFile.project.title}</p>
                </div>
              )}
            </div>
            
            {selectedFile.access_level === 'public' && (
              <div className="mt-4">
                <strong>{t("ankeai.fileStorage.publicUrl")}:</strong>
                <div className="flex items-center space-x-2 mt-2">
                  <input 
                    type="text" 
                    value={selectedFile.file_path 
                      ? generatePublicUrl(selectedFile.file_path, selectedFile.access_level, true) 
                      : generatePublicUrl(selectedFile.id, selectedFile.access_level, false) || ''} 
                    readOnly 
                    className="flex-1 p-2 border rounded text-sm"
                  />
                  <AButton 
                    icon={<LinkOutlined />} 
                    onClick={() => handleCopyPublicUrl(selectedFile)}
                  >
                    {t("ankeai.fileStorage.copyUrl")}
                  </AButton>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AnkeFileStorageManage;