import { query } from '@/services/stat';

const initState = {
  member: {
    total: 0,
    recharged: 0,
    consumed: 0,
  },
  level: {
    one_level: 0,
    two_level: 0,
    three_level: 0,
    four_level: 0,
    five_level: 0,
    six_level: 0,
  },
  contract: {
    sold: 0,
  },
  income: {
    usdt: 0,
  },
  expend: {
    machine_btc: 0,
    hold_contract_usdt: 0,
    buy_contract_ttc: 0,
    buy_contract_point: 0,
    recommend_usdt: 0,
    recommend_ttc: 0,
    diff_level_usdt: 0,
    diff_level_ttc: 0,
    admin_usdt: 0,
    admin_btc: 0,
    admin_ttc: 0,
    admin_point: 0,
    btc_count: 0,
    ttc_count: 0,
    usdt_count: 0,
    point_count: 0,
  },
};

const Model = {
  namespace: 'stat',
  state: initState,
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
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    clear() {
      return initState;
    },
  },
};
export default Model;
