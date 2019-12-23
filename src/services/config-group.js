import request from '@/utils/request';
import * as API from '@/api';

export async function get(group) {
  return request(`${API.SYSTEM.SETTING}/${group}`, {
    method: 'GET'
  });
}

export async function update(params) {
  return request(`${API.SYSTEM.SETTING}/${params.key}`, {
    method: 'PUT',
    data: params,
  });
}
