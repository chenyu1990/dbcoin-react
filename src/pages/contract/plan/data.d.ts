export interface TableListItem {
  id: number;
  contract_id: number;
  usdt_base: number;
  btc_base: number;
  ttc_base: number;
  date: Date;
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
