export interface TableListItem {
  id: number;
  name: string;
  number: number;
  contract_id: string;
  power: string;
  count: number;
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
