import { request, ankeRequest } from "../request";

/**
 * 获取文件列表
 */
export function fetchFileList(params: Api.AnkeAI.FileSearchParams) {
  return ankeRequest<Api.AnkeAI.FileStorageList>({
    method: "get",
    params,
    url: "/files",
  });
}

/**
 * 获取图片文件列表（仅返回图片类型）
 */
export function fetchImageFileList(params?: {
  page?: number;
  size?: number;
  project_id?: number;
}) {
  return ankeRequest<Api.AnkeAI.FileStorageList>({
    method: "get",
    params,
    url: "/files/images",
  });
}

/**
 * 获取文件详情
 */
export function fetchFileDetail(fileId: number) {
  return ankeRequest<Api.AnkeAI.FileStorage>({
    method: "get",
    url: `/files/${fileId}`,
  });
}

/**
 * 上传文件
 */
export function ankeUploadFile(formData: FormData) {
  return ankeRequest<Api.AnkeAI.FileUploadResponse>({
    method: "post",
    data: formData,
    url: "/files/upload",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 更新文件信息
 */
export function ankeUpdateFile(
  fileId: number,
  data: Api.AnkeAI.FileUpdateParams,
) {
  return ankeRequest<Api.AnkeAI.FileStorage>({
    method: "put",
    data,
    url: `/files/${fileId}`,
  });
}

/**
 * 删除文件
 */
export function ankeDeleteFile(fileId: number) {
  return ankeRequest<void>({
    method: "delete",
    url: `/files/${fileId}`,
  });
}

/**
 * 下载文件
 */
export function ankeDownloadFile(fileId: number) {
  return ankeRequest<Blob>({
    method: "get",
    url: `/files/${fileId}/download`,
    responseType: "blob",
  });
}

/**
 * 获取文件下载链接
 */
export function ankeGetFileDownloadUrl(fileId: number) {
  return ankeRequest<{ download_url: string }>({
    method: "get",
    url: `/files/${fileId}/download-url`,
  });
}

/**
 * 批量删除文件
 */
export function ankeBatchDeleteFiles(fileIds: number[]) {
  return ankeRequest<void>({
    method: "delete",
    data: { file_ids: fileIds },
    url: "/files/batch-delete",
  });
}

/**
 * 获取用户文件统计信息
 */
export function ankeFetchFileStats() {
  return ankeRequest<{
    total_files: number;
    total_size: number;
    total_size_mb: number;
    by_access_level: Record<Api.AnkeAI.FileAccessLevel, number>;
  }>({
    method: "get",
    url: "/files/stats",
  });
}
