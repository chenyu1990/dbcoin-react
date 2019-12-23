import { create, query, remove, update, get } from '@/services/contract';
import { notification, Icon } from 'antd';

const Model = {
  namespace: 'contract',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(query, payload);
      for (let contract of data.list) {
        contract.sale_percent = (contract.sold / contract.total) * 100;
        contract.sale_percent.toFixed(2);
      }
      yield put({
        type: 'save',
        payload: data,
      });
    },

    *updateLoading({ payload }, { put }) {
      yield put({
        type: 'updateArr',
        payload: payload,
      });
    },

    *get({ payload, success }, { call }) {
      const { response, data } = yield call(get, payload);
      if (response.status === 200) {
        if (success) success(data);
      }
    },

    *add({ payload, callback }, { call }) {
      const { response } = yield call(create, payload);
      if (response.status === 200) {
        notification.open({
          message: '添加合约成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });
      }
      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      const { response } = yield call(remove, payload);
      if (response.status === 200) {
        notification.open({
          message: '删除合约成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });

        yield put({
          type: 'delete',
          payload: payload,
        });
      }
      if (callback) callback();
    },

    *update({ payload, callback }, { call }) {
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        notification.open({
          message: '更新合约成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });
      }
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
export default Model;
