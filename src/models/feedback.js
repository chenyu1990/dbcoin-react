import { query, status } from '@/services/feedback';
import { notification, Icon } from 'antd';

const Model = {
  namespace: 'feedback',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const { response, data } = yield call(query, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: data,
        });
      }
      if (callback) callback({ response, data });
    },

    *status({ payload, callback }, { call }) {
      const { response } = yield call(status, payload);
      if (response.status === 200) {
        notification.open({
          message: '更新反馈状态成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 2,
        });
      }
      if (callback) callback();
    },
  },
  reducers: {
    updateArr(state, action) {
      state.data.list = state.data.list.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            status: 2,
          };
        }
        return item;
      });
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
