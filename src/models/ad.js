import { add, query, update, remove, disable, enable } from '@/services/ad';
import { notification, Icon } from 'antd';

const Model = {
  namespace: 'ad',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(query, payload);
      yield put({
        type: 'save',
        payload: data,
      });
    },

    *add({ payload, callback }, { call, put }) {
      const { response, data } = yield call(add, payload);
      if (response.status === 200) {
        notification.open({
          message: '添加广告位成功',
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

    *update({ payload, callback }, { call, put }) {
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        notification.open({
          message: '更新广告位成功',
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
    *updateLoading({ payload }, { put }) {
      yield put({
        type: 'updateArr',
        payload: payload,
      });
    },
    *remove({ payload, callback }, { call, put }) {
      const { response } = yield call(remove, payload);
      if (response.status === 200) {
        notification.open({
          message: '移除广告位成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });

        yield put({
          type: 'removeArr',
          payload: payload,
        });
      }
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put }) {
      yield call(enable, payload);
      yield put({
        type: 'updateArr',
        payload: payload,
      });
      if (callback) callback();
    },
    *disable({ payload, callback }, { call, put }) {
      yield call(disable, payload);
      yield put({
        type: 'updateArr',
        payload: payload,
      });
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
  },
};
export default Model;
