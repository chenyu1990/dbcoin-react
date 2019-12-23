import { query, generateExcel, getExcel } from '@/services/contract-order';
import moment from 'moment';

const Model = {
  namespace: 'contractOrder',
  state: {
    data: {
      list: [],
      pagination: {},
    },
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

    *generateExcel({ payload, success }, { call }) {
      const { response } = yield call(generateExcel, payload);
      if (response.status === 200) {
        if (success) success();
      }
    },
    *getExcel({ success }, { call }) {
      const { response, data } = yield call(getExcel);
      if (response.status === 200) {
        const blobUrl = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        const filename = moment().format('YYYY-MM-DD') + '-合约订单.xlsx';
        a.href = blobUrl;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        if (success) success();
      }
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
