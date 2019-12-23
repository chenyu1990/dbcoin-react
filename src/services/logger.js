import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.LOGGER, {
    method: 'GET',
    params,
  });
}
