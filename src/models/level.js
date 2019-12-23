import { add, query, remove, update } from '@/services/level';
import { notification, Icon } from 'antd';

const Model = {
  namespace: 'level',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    * fetch({ payload }, { call, put }) {
      const { data } = yield call(query, payload);
      yield put({
        type: 'save',
        payload: data,
      });
    },

    * add({ payload, callback }, { call, put }) {
      const { response, data } = yield call(add, payload);
      if (response.status === 200) {
        notification.open({
          message: '添加等级成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>,
          duration: 1,
        });

        yield put({
          type: 'save',
          payload: data,
        });
      }
      if (callback) callback();
    },

    * remove({ payload, callback }, { call, put }) {
      const { response } = yield call(remove, payload);
      if (response.status === 200) {
        notification.open({
          message: '删除等级成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>,
          duration: 1,
        });

        yield put({
          type: 'delete',
          payload: payload,
        });
      }
      if (callback) callback();
    },

    * update({ payload, callback }, { call, put }) {
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        notification.open({
          message: '更新等级成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>,
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
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
  },
};
export default Model;
