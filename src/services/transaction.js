import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.TRANSACTION, {
    method: 'GET',
    params,
  });
}

export async function generateExcel(params) {
  return request(API.TransactionExcel.Base, {
    method: 'POST',
    data: params,
  });
}

export async function getExcel() {
  return request(API.TransactionExcel.Base, {
    responseType: 'blob',
  });
}
