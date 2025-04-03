import { request } from "../request";

/**
 * 获取系统配置列表
 */
export function fetchGetConfigList(
  params: Api.SystemManage.ConfigSearchParams,
) {
  return request<Api.SystemManage.ConfigList>({
    method: "get",
    // params,
    url: "/system/configs",
  });
}

/**
 * 创建系统配置
 */
export function createConfig(data: Api.SystemManage.ConfigItem) {
  return request<Api.SystemManage.ConfigItem>({
    method: "post",
    data,
    url: "/system/configs",
  });
}

/**
 * 更新系统配置
 */
export function updateConfig(
  id: number,
  data: Partial<Api.SystemManage.ConfigItem>,
) {
  return request<Api.SystemManage.ConfigItem>({
    method: "put",
    data,
    url: `/system/configs/${id}`,
  });
}

/**
 * 删除系统配置
 */
export function deleteConfig(id: number) {
  return request<void>({
    method: "delete",
    url: `/system/configs/${id}`,
  });
}
