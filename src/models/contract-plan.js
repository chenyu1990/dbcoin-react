import { add, query, update } from '@/services/contract-plan';
import moment from 'moment';
import { notification, Icon } from 'antd';

const Model = {
  namespace: 'contractPlan',
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
          message: '添加合约计划成功',
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
          message: '更新合约计划成功',
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
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
export default Model;
