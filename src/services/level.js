import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.LEVEL.MAIN, {
    params,
  });
}
export async function remove(params) {
  return request('/api/rule', {
    method: 'DELETE',
    data: params,
  });
}
export async function add(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function update(params) {
  return request(API.LEVEL.MAIN, {
    method: 'PUT',
    data: params,
  });
}
