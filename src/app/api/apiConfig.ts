export const getApiConfig = () => {
  const apiUrl =
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1` ||
    "https://seal-app-m2hhp.ondigitalocean.app/api/v1";

  return { apiUrl };
};
