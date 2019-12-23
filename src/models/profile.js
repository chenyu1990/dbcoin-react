import { query, update, point } from '@/services/profile';
import { Icon, notification } from 'antd';

const Model = {
  namespace: 'profile',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    profiles: {}
  },
  effects: {
    *fetch({ callback, payload }, { call, put }) {
      const { response, data } = yield call(query, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: data,
        });
      }
      if (callback) callback({ response, data });
    },
    *pureFetch({ callback, payload }, { call }) {
      const { response, data } = yield call(query, payload);
      if (callback) callback({ response, data });
    },

    *point({ payload }, { call, put }) {
      const { response } = yield call(point, payload);
      if (response.status === 200) {
        notification.open({
          message: '更新积分成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });

        yield put({
          type: 'updatePoint',
          payload: payload,
        });
      }
    },

    *update({ payload, callback }, { call, put }) {
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        notification.open({
          message: '更新用户资料成功',
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
  },
  reducers: {
    updatePoint(state, action) {
      state.data.list = state.data.list.map(item => {
        if (item.record_id === action.payload.record_id) {
          if (action.payload.action === 'increase') {
            item.usdt += action.payload.usdt;
            item.btc += action.payload.btc;
            item.ttc += action.payload.ttc;
            item.point += action.payload.point;
          } else if (action.payload.action === 'decrease') {
            item.usdt -= action.payload.usdt;
            item.btc -= action.payload.btc;
            item.ttc -= action.payload.ttc;
            item.point -= action.payload.point;
          } else if (action.payload.action === 'modify') {
            item.usdt = action.payload.usdt;
            item.btc = action.payload.btc;
            item.ttc = action.payload.ttc;
            item.point = action.payload.point;
          }
          return item;
        }
        return item;
      });
      return state;
    },
    updateArr(state, action) {
      state.data.list = state.data.list.map(item => {
        if (item.record_id === action.payload.record_id) {
          return action.payload;
        }
        return item;
      });
      return state;
    },
    save(state, action) {
      let profiles = {};
      action.payload.list.map(item => {
        profiles[item.record_id] = item;
      });
      return {
        ...state,
        data: action.payload,
        profiles
      };
    },
  },
};
export default Model;
