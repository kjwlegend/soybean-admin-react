import type { Api } from '@/types';

/**
 * 根据MIME类型和文件名获取文件类型
 */
export function getFileType(mimeType?: string, fileName?: string): Api.AnkeAI.FileType {
  if (!mimeType && !fileName) return 'other';
  
  const mime = mimeType?.toLowerCase() || '';
  const ext = fileName?.toLowerCase().split('.').pop() || '';

  // 图片类型
  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp', 'tiff'].includes(ext)) {
    return 'image';
  }

  // 视频类型
  if (mime.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'].includes(ext)) {
    return 'video';
  }

  // 音频类型
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(ext)) {
    return 'audio';
  }

  // 文档类型
  if (
    [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'text/plain',
      'text/markdown',
    ].includes(mime) ||
    ['pdf', 'doc', 'docx', 'rtf', 'txt', 'md', 'odt'].includes(ext)
  ) {
    return 'document';
  }

  // 表格类型
  if (
    [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ].includes(mime) ||
    ['xls', 'xlsx', 'csv', 'ods'].includes(ext)
  ) {
    return 'spreadsheet';
  }

  // 演示文稿类型
  if (
    [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ].includes(mime) ||
    ['ppt', 'pptx', 'odp'].includes(ext)
  ) {
    return 'presentation';
  }

  // 压缩文件类型
  if (
    [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',
    ].includes(mime) ||
    ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)
  ) {
    return 'archive';
  }

  // 文本类型
  if (
    mime.startsWith('text/') ||
    ['json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx', 'vue', 'py', 'java', 'cpp', 'c', 'h'].includes(ext)
  ) {
    return 'text';
  }

  return 'other';
}

/**
 * 获取文件类型的显示名称
 */
export function getFileTypeLabel(fileType: Api.AnkeAI.FileType): string {
  const labels: Record<Api.AnkeAI.FileType, string> = {
    image: '图片',
    document: '文档',
    spreadsheet: '表格',
    presentation: '演示文稿',
    video: '视频',
    audio: '音频',
    archive: '压缩文件',
    text: '文本',
    other: '其他',
  };
  
  return labels[fileType] || '其他';
}

/**
 * 获取文件类型的图标
 */
export function getFileTypeIcon(fileType: Api.AnkeAI.FileType): string {
  const icons: Record<Api.AnkeAI.FileType, string> = {
    image: 'file-image-outlined',
    document: 'file-text-outlined',
    spreadsheet: 'file-excel-outlined',
    presentation: 'file-ppt-outlined',
    video: 'video-camera-outlined',
    audio: 'audio-outlined',
    archive: 'file-zip-outlined',
    text: 'file-text-outlined',
    other: 'file-outlined',
  };
  
  return icons[fileType] || 'file-outlined';
}

/**
 * 获取文件类型的颜色
 */
export function getFileTypeColor(fileType: Api.AnkeAI.FileType): string {
  const colors: Record<Api.AnkeAI.FileType, string> = {
    image: 'green',
    document: 'blue',
    spreadsheet: 'cyan',
    presentation: 'orange',
    video: 'purple',
    audio: 'magenta',
    archive: 'red',
    text: 'geekblue',
    other: 'default',
  };
  
  return colors[fileType] || 'default';
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成公共访问URL
 * @param filePathOrId - 文件路径或文件ID
 * @param accessLevel - 访问级别
 * @param isFilePath - 是否是文件路径（true时第一个参数是路径，false时是ID）
 */
export function generatePublicUrl(
  filePathOrId: string | number, 
  accessLevel: Api.AnkeAI.FileAccessLevel,
  isFilePath: boolean = false
): string | null {
  if (accessLevel !== 'public') return null;
  
  // 根据实际部署环境调整域名
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:8000';
  
  // 如果是文件路径，直接拼接静态文件访问路径
  if (isFilePath && typeof filePathOrId === 'string') {
    // 统一处理路径分隔符（Windows使用\，Unix使用/）
    let normalizedPath = filePathOrId.replace(/\\/g, '/');
    
    // 移除可能的前缀路径，包括完整路径和storage前缀
    // 处理如 D:\codes\...\storage\public\file.png 或 /storage/public/file.png
    normalizedPath = normalizedPath.replace(/^.*[\\\/]storage[\\\/]/, '');
    
    // 确保没有重复的storage
    normalizedPath = normalizedPath.replace(/^storage[\\\/]/, '');
    
    return `${baseUrl}/storage/${normalizedPath}`;
  }
  
  // 兼容旧的ID方式
  return `${baseUrl}/api/v1/app/AnkeAI/files/public/${filePathOrId}`;
}