import request from '@/utils/request';
import * as API from '@/api';

export async function accountLogin(params) {
  params.type = 1;
  return request(API.ACCOUNT.LOGIN, {
    method: 'POST',
    data: params,
  });
}

export async function accountLogout() {
  return request(API.ACCOUNT.LOGOUT, {
    method: 'POST',
  });
}

// 查询当前用户菜单树
export async function menuTree() {
  return request(API.ACCOUNT.MENU_TREE);
}

export async function info() {
  return request(API.ACCOUNT.INFO);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
