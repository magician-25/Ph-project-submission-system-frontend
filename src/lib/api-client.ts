import { ofetch } from "ofetch";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

const apiClient = ofetch.create({
  baseURL: apiBaseUrl,
  credentials: "include",
});

export default apiClient;
