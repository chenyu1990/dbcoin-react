import { query } from '@/services/logger';

const Model = {
  namespace: 'logger',
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
