export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const API_VERSION = "v1";

export const getApiConfig = () => {
  const apiUrl = `${API_BASE_URL}/api/${API_VERSION}/admin`;

  return { apiUrl };
};

export const getLoginSiwsMessageEndpoint = (address: string): string => {
  return `/login/${address}/siws_message`;
};

export const loginEndpoint = (): string => {
  return `/login`;
};

export const addWhitelistEndpoint = (): string => {
  return `/whitelist/add`;
};

export const listWhitelistEndpoint = (): string => {
  return `/whitelist/list`;
};

export const updateWhitelistEndpoint = (): string => {
  return `/whitelist/update`;
};

export const removeWhitelistEndpoint = (address: string): string => {
  return `/whitelist/remove/${address}`;
};

export const addAdminUserEndpoint = (): string => {
  return `/admin_user/add`;
};
