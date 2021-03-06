import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.TRANSACTION_BLOCK, {
    method: 'GET',
    params,
  });
}
