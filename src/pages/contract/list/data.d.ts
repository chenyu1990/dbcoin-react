export interface TableListItem {
  id: number;
  name: string;
  summary: string;
  total: number;
  sale_count: number;
  power: number;
  content: string;
  usdt_fee: number;
  btc_fee: number;
  ttc_fee: number;
  got_usdt: number;
  got_btc: number;
  got_ttc: number;
  got_point: number;
  sale_time_bgn: Date;
  sale_time_end: Date;
  machine_auto_begin: Date;
  status: number;
  machine_status: number;
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
