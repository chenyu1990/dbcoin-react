export interface TableListItem {
  id: number;
  coin_type: number;
  record_id: string;
  tx_id: string;
  address: string;
  category: number;
  amount: number;
  fee: number;
  confirmations: number;
  status: number;
  time: Date;
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
