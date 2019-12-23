import { add, query, remove, update } from '@/services/contract';
import moment from 'moment';
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
        contract.sale_percent = (contract.sale_count / contract.total) * 100;
        contract.sale_percent.toFixed(2);
        contract.sale_time_bgn = moment(contract.sale_time_bgn * 1000);
        contract.sale_time_end = moment(contract.sale_time_end * 1000);
        contract.machine_auto_begin = moment(contract.machine_auto_begin);
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
    *add({ payload, callback }, { call, put }) {
      payload.sale_time_bgn = moment(payload.sale_time_bgn).unix();
      payload.sale_time_end = moment(payload.sale_time_end).unix();
      const { response, data } = yield call(add, payload);
      if (response.status === 200) {
        notification.open({
          message: '添加合约成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });

        data.sale_time_bgn = moment(data.sale_time_bgn).unix();
        data.sale_time_end = moment(data.sale_time_end).unix();
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
          message: '删除合约成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });

        payload.sale_time_bgn = moment(payload.sale_time_bgn).unix();
        payload.sale_time_end = moment(payload.sale_time_end).unix();
        yield put({
          type: 'delete',
          payload: payload,
        });
      }
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      payload.sale_time_bgn = moment(payload.sale_time_bgn).unix();
      payload.sale_time_end = moment(payload.sale_time_end).unix();
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        notification.open({
          message: '更新合约成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });

        payload.sale_time_bgn = moment(payload.sale_time_bgn * 1000);
        payload.sale_time_end = moment(payload.sale_time_end * 1000);
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
