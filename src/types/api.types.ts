export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data?: TData;
  meta?: ApiMeta;
}

export interface ApiMeta {
  searchTerm?: string;
  page?: number;
  limit?: number;
  totalPages?: number;
  dataCount?: number;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
}
