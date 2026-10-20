export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data?: TData;
  meta?: Meta
}

interface Meta {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortOrder?: "asc" | "desc";
  sortBy?: string;

  // biome-ignore lint/suspicious/noExplicitAny: <flexible query params>
  [key: string]: any;
}
