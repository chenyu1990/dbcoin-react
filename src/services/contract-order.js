import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.CONTRACT.ORDER.QUERY, {
    params,
  });
}

export async function generateExcel(params) {
  return request(API.CONTRACT.ORDER.Excel, {
    method: 'POST',
    data: params,
  });
}

export async function getExcel() {
  return request(API.CONTRACT.ORDER.Excel, {
    responseType: 'blob',
  });
}
