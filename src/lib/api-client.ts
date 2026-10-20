import { ofetch } from "ofetch";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = ofetch.create({
  baseURL: apiBaseUrl,
  credentials: "include",
});

export function requireApiBaseUrl() {
  if (!apiBaseUrl) {
    throw new Error(
      "Set NEXT_PUBLIC_API_BASE_URL to the backend API root before making API requests.",
    );
  }
}

export default apiClient;
