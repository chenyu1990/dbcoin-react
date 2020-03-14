import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.ARTICLE.MAIN, {
    params,
  });
}
export async function remove(params) {
  return request(`${API.ARTICLE.MAIN}/${params.article_id}`, {
    method: 'DELETE',
  });
}

export async function disable(params) {
  return request(`${API.ARTICLE.MAIN}/${params.article_id}/disable`, {
    method: 'PATCH',
  });
}
export async function enable(params) {
  return request(`${API.ARTICLE.MAIN}/${params.article_id}/enable`, {
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
  return request(`${API.ARTICLE.MAIN}/${params.article_id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function get(article_id) {
  return request(`${API.ARTICLE.GET}/${article_id}`);
}
