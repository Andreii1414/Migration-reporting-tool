import { SERVER_URL } from "./config.js";

export const getAuthHeader = async () => {
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const meResponse = await fetch(`${SERVER_URL}/api/profile/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const meData = await meResponse.json();

  if (meData?.isSuccess) {
    return { Authorization: `Bearer ${accessToken}` };
  }

  const tokenResponse = await fetch(`${SERVER_URL}/api/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData?.isSuccess) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }

  const newAccessToken = tokenData.token;
  localStorage.setItem("accessToken", newAccessToken);

  return { Authorization: `Bearer ${newAccessToken}` };
};
