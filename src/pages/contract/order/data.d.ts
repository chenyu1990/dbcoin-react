export interface TableListItem {
  id: number;
  name: string;
  number: number;
  contract_id: number;
  power: string;
  count: number;
  usdt_fee: number;
  btc_fee: number;
  ttc_fee: number;
  got_usdt: number;
  got_btc: number;
  got_ttc: number;
  got_point: number;
  status: number;
  machine_status: number;
  created_at: number;
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
  page: number;
}
