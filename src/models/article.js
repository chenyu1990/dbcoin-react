import { add, query, remove, update, get, disable, enable } from '@/services/article';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Icon, notification } from 'antd';

const Model = {
  namespace: 'article',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    article: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { response, data } = yield call(query, payload);
      if (response.status === 200) {
        for (let contract of data.list) {
          contract.sale_percent = (contract.sale_count / contract.total) * 100;
          contract.sale_percent.toFixed(2);
          contract.sale_time_bgn = moment(contract.sale_time_bgn * 1000);
          contract.sale_time_end = moment(contract.sale_time_end * 1000);
        }
        yield put({
          type: 'save',
          payload: data,
        });
      }
    },

    *get({ payload, callback }, { call, put }) {
      const { response, data } = yield call(get, payload);
      if (response.status === 200) {
        yield put({
          type: 'content',
          payload: data,
        });
        if (callback) callback(data);
      }
    },

    *add({ payload, callback }, { call, put }) {
      const { response, data } = yield call(add, payload);
      if (response.status === 200) {
        notification.open({
          message: '添加文章成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });
        yield put({
          type: 'addArr',
          payload: data,
        });
      }
      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      const { response } = yield call(remove, payload);
      if (response.status === 200) {
        notification.open({
          message: '删除文章成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });
        yield put({
          type: 'removeArr',
          payload: payload,
        });
      }
      if (callback) callback({ response });
    },

    *update({ payload, callback }, { call, put }) {
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        notification.open({
          message: '更新文章成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });

        yield put({
          type: 'updateArr',
          payload: payload,
        });
      }
      if (callback) callback();
    },

    *edit({ payload }, { put }) {
      yield put(
        routerRedux.push({
          pathname: `article/${payload.id}`,
        }),
      );
    },
    *enable({ payload, callback }, { call, put }) {
      const { response } = yield call(enable, payload);
      if (response.status === 200) {
        yield put({
          type: 'updateArr',
          payload: payload,
        });
      }
      if (callback) callback();
    },
    *disable({ payload, callback }, { call, put }) {
      const { response } = yield call(disable, payload);
      if (response.status === 200) {
        yield put({
          type: 'updateArr',
          payload: payload,
        });
      }
      if (callback) callback();
    },
  },
  reducers: {
    updateArr(state, action) {
      state.data.list = state.data.list.map(item => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
      return state;
    },
    addArr(state, action) {
      state.data.list.unshift(action.payload);
      return state;
    },
    removeArr(state, action) {
      state.data.list.splice(state.data.list.findIndex(item => item.id === action.payload.id), 1);
      return state;
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    content(state, action) {
      return {
        ...state,
        article: action.payload,
      };
    },
  },
};
export default Model;
