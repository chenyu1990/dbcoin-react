export interface TableListItem {
  id: number;
  created_at: Date;
  record_id: string;
  peer_uid: string;
  contract_id: number;
  earn_type: number;
  usdt: number;
  btc: number;
  ttc: number;
  point: number;
  remark: string;
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
