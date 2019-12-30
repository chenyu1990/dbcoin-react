export interface TableListItem {
  contract_id: string;
  name: string;
  summary: string;
  total: number;
  sold: number;
  price: number;
  content: string;
  sale_time_bgn: Date;
  sale_time_end: Date;
  status: number;
  sale_percent: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  page: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
