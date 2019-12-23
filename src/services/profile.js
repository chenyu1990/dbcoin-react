import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.PROFILE.MAIN, {
    params,
  });
}

export async function update(params) {
  return request(API.PROFILE.MAIN, {
    method: 'PUT',
    data: params,
  });
}

export async function point(params) {
  return request(API.PROFILE.POINT, {
    method: 'PUT',
    data: params,
  });
}
