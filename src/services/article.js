import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.ARTICLE.MAIN, {
    params,
  });
}
export async function remove(params) {
  return request(`${API.ARTICLE.MAIN}/${params.id}`, {
    method: 'DELETE',
  });
}

export async function disable(params) {
  return request(`${API.ARTICLE.MAIN}/${params.id}/disable`, {
    method: 'PATCH',
  });
}
export async function enable(params) {
  return request(`${API.ARTICLE.MAIN}/${params.id}/enable`, {
    method: 'PATCH',
  });
}

export async function add(params) {
  return request(API.ARTICLE.MAIN, {
    method: 'POST',
    data: params,
  });
}
export async function update(params) {
  return request(`${API.ARTICLE.MAIN}/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function get(id) {
  return request(`${API.ARTICLE.GET}/${id}`);
}
