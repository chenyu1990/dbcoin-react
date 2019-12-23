import { stat, btcWalletBalances, usdtWalletBalances, validateAddress,
  withdrawBtc, withdrawUsdt } from '@/services/wallet';
import { Modal } from 'antd';

const { success: successModal } = Modal;

const Model = {
  namespace: 'wallet',
  state: {
    btc: {},
    omni: {},
    stat: undefined,
  },
  effects: {
    *stat({ payload }, { call, put }) {
      const { response, data } = yield call(stat, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: { stat: data },
        });
      }
    },
    *withdrawBtc({ payload, success }, { call }) {
      const { response, data } = yield call(withdrawBtc, payload);
      if (response.status === 200) {
        successModal({
          title: '转出成功',
          content: `交易流水：${data}`,
        });
        if (success) success();
      }
    },
    *withdrawUsdt({ payload, success }, { call }) {
      const { response, data } = yield call(withdrawUsdt, payload);
      if (response.status === 200) {
        successModal({
          title: '转出成功',
          content: `交易流水：${data}`,
        });
        if (success) success();
      }
    },
    *btcWalletBalances({ payload }, { call, put }) {
      const { response, data } = yield call(btcWalletBalances);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: { btc: data },
        });
      }
    },
    *usdtWalletBalances({ payload }, { call, put }) {
      const { response, data } = yield call(usdtWalletBalances);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: { omni: data },
        });
      }
    },
    *validateAddress({ payload, callback }, { call }) {
      const { response } = yield call(validateAddress, payload);
      if (callback) callback(response);
    },
  },
  reducers: {
    save(state, { payload: data }) {
      return { ...state, ...data };
    },
  },
};
export default Model;
