export interface TableListItem {
  id: number;
  record_id: string;
  cat_id: number;
  display_order: number;
  author: string;
  title: string;
  summary: string;
  media: string;
  image: string;
  thumb: string;
  content: string;
  click_count: number;
  status: number;
  created_at: Date;
  updated_at: Date;
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
