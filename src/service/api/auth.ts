import { request } from "../request";

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, password: string) {
  const formData = new FormData();
  formData.append("username", userName);
  formData.append("password", password);

  return request<Api.Auth.LoginToken>({
    data: formData,
    method: "post",
    url: "/admin/login",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: "/admin/me" });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    data: {
      refreshToken,
    },
    method: "post",
    url: "/auth/refreshToken",
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ params: { code, msg }, url: "/auth/error" });
}
