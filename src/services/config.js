import request from '@/utils/request';
import * as API from '@/api';

export async function add(params) {
  return request(API.SYSTEM.SETTING, {
    method: 'POST',
    data: params,
  });
}

export async function query(params) {
  return request(API.SYSTEM.SETTING, {
    method: 'GET',
    params,
  });
}

export async function update(params) {
  return request(API.SYSTEM.SETTING, {
    method: 'PUT',
    data: params,
  });
}

export async function patch() {
  return request(API.SYSTEM.SETTING, {
    method: 'PATCH',
  });
}
