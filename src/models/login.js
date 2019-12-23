import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { accountLogin, accountLogout, getFakeCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import store from '@/utils/store';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * login({ payload }, { call, put }) {
      const { response, data } = yield call(accountLogin, payload);

      if (response.status === 200 && data.expires_at > 0) {
        yield put({
          type: 'changeLoginStatus',
        }); // Login successfully

        store.setAccessToken(data);

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    * getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    * logout(_, { call, put }) {
      const { response } = yield call(accountLogout);
      if (response.status === 200) {
        store.clearAccessToken();

        const { redirect } = getPageQuery(); // redirect

        if (window.location.pathname !== '/user/login' && !redirect) {
          yield put(
            routerRedux.replace({
              pathname: '/user/login',
              search: stringify({
                redirect: window.location.href,
              }),
            }),
          );
        }
      }
    },
  },
  reducers: {
    changeLoginStatus() {
      setAuthority('admin');
      return {
        status: 'ok',
      };
    },
  },
};
export default Model;
