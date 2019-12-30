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

export async function create(params) {
  return request(API.CONTRACT.MAIN, {
    method: 'POST',
    data: params,
  });
}

export async function get(params) {
  return request(`${API.CONTRACT.MAIN}/${params.contract_id}`);
}

export async function update(params) {
  return request(`${API.CONTRACT.MAIN}/${params.contract_id}`, {
    method: 'PUT',
    data: params,
  });
}
