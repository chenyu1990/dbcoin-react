import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.FEEDBACK.MAIN, {
    params,
  });
}

export async function status(id) {
  return request(`${API.FEEDBACK.MAIN}/${id}`, {
    method: 'PUT',
  });
}
