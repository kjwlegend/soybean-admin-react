import React, { useState } from 'react';
import { Modal, Form, Select, Upload, Button, Space, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ankeUploadFile } from '@/service/api';
import type { UploadFile } from 'antd/es/upload/interface';

interface FileUploadModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ open, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.warning(t('ankeai.fileStorage.pleaseSelectFiles'));
      return;
    }

    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setUploading(true);

      // 逐个上传文件
      let successCount = 0;
      let failCount = 0;
      
      for (const file of fileList) {
        try {
          // 确保有有效的文件对象
          if (!file.originFileObj) {
            console.error(`No file object for ${file.name}`);
            failCount++;
            continue;
          }

          const formData = new FormData();
          formData.append('file', file.originFileObj);
          
          // 添加访问级别，确保有值
          formData.append('access_level', values.access_level || 'private');
          
          // 添加项目ID（如果有的话），转换为字符串
          if (values.project_id) {
            formData.append('project_id', values.project_id.toString());
          }

          console.log('Uploading file:', file.name, 'with access_level:', values.access_level);
          await ankeUploadFile(formData);
          successCount++;
        } catch (fileError) {
          failCount++;
          console.error(`Failed to upload ${file.name}:`, fileError);
        }
      }

      // 显示上传结果
      if (successCount === fileList.length) {
        message.success(t('ankeai.fileStorage.uploadSuccess') + ` (${successCount})`);
      } else if (successCount > 0) {
        message.warning(`${successCount} ${t('ankeai.fileStorage.uploadSuccess')}, ${failCount} ${t('ankeai.fileStorage.uploadFailed')}`);
      } else {
        throw new Error('All files failed to upload');
      }
      
      handleCancel();
      onSuccess();
    } catch (error) {
      message.error(t('ankeai.fileStorage.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: File) => {
      // 检查文件大小 (10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error(t('ankeai.fileStorage.fileSizeExceeded'));
        return false;
      }

      // 检查文件类型
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'text/markdown',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/json', 'text/csv'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        message.error(t('ankeai.fileStorage.fileTypeNotSupported'));
        return false;
      }

      // 创建 UploadFile 对象并设置 originFileObj
      const uploadFile: UploadFile = {
        uid: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        originFileObj: file,
        status: 'done',
      };
      
      setFileList([...fileList, uploadFile]);
      return false; // 阻止自动上传
    },
    fileList,
    multiple: true,
    accept: 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.md,.json,.csv'
  };

  return (
    <Modal
      title={t('ankeai.fileStorage.uploadFiles')}
      open={open}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t('common.cancel')}
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={uploading}
          onClick={handleSubmit}
        >
          {t('ankeai.fileStorage.startUpload')}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ access_level: 'private' }}>
        <Form.Item
          name="access_level"
          label={t('ankeai.fileStorage.accessLevel')}
          rules={[{ required: true, message: t('ankeai.fileStorage.pleaseSelectAccessLevel') }]}
        >
          <Select>
            <Select.Option value="private">{t('ankeai.fileStorage.private')}</Select.Option>
            <Select.Option value="project">{t('ankeai.fileStorage.projectLevel')}</Select.Option>
            <Select.Option value="public">{t('ankeai.fileStorage.public')}</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="project_id" label={t('ankeai.fileStorage.project')}>
          <Select allowClear placeholder={t('ankeai.fileStorage.selectProject')}>
            {/* 项目选项需要从API加载 */}
          </Select>
        </Form.Item>

        <Form.Item label={t('ankeai.fileStorage.selectFiles')}>
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">{t('ankeai.fileStorage.dragToUpload')}</p>
            <p className="ant-upload-hint">{t('ankeai.fileStorage.uploadHint')}</p>
          </Upload.Dragger>
        </Form.Item>

        {fileList.length > 0 && (
          <div className="mt-4">
            <h4>{t('ankeai.fileStorage.selectedFiles')}:</h4>
            <ul className="list-disc list-inside">
              {fileList.map((file, index) => (
                <li key={index} className="text-sm">
                  {file.name} ({(file.size! / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default FileUploadModal;