import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  console.log('debug fetch query', params)
  return request(API.ATTACHMENT.MAIN, {
    params,
  });
}

export async function add(params) {
  return request(API.ATTACHMENT.MAIN, {
    method: 'POST',
    data: params,
  });
}

export async function remove(params) {
  return request(`${API.ATTACHMENT.EDIT}/${params.id}`, {
    method: 'DELETE',
  });
}
