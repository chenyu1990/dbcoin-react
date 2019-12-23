import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.CONTRACT.PLAN.QUERY, {
    params,
  });
}

export async function add(params) {
  return request(API.CONTRACT.PLAN.QUERY, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  return request(`${API.CONTRACT.PLAN.QUERY}/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
