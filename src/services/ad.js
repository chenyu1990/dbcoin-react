import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.AD.QUERY, {
    params,
  });
}

export async function add(params) {
  return request(API.AD.EDIT, {
    method: 'POST',
    data: params,
  });
}

export async function update(params) {
  return request(`${API.AD.EDIT}/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function disable(params) {
  return request(`${API.AD.EDIT}/${params.id}/disable`, {
    method: 'PATCH',
  });
}
export async function enable(params) {
  return request(`${API.AD.EDIT}/${params.id}/enable`, {
    method: 'PATCH',
  });
}

export async function remove(params) {
  return request(`${API.AD.EDIT}/${params.id}`, {
    method: 'DELETE',
  });
}
