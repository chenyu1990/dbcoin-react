import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.CONTRACT.MAIN, {
    params,
  });
}

export async function remove(params) {
  return request(API.CONTRACT.MAIN, {
    method: 'DELETE',
    data: params,
  });
}

export async function add(params) {
  return request(API.CONTRACT.MAIN, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  return request(`${API.CONTRACT.MAIN}/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
