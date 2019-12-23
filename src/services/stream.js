import request from '@/utils/request';
import * as API from '@/api';

export async function count(params) {
  return request(API.STREAM.MAIN, {
    method: 'GET',
    params,
  });
}
