import { count } from '@/services/stream';

const Model = {
  namespace: 'stream',
  state: {
  },
  effects: {
    * count({ payload, success }, { call, put }) {
      const { response, data } = yield call(count, payload);
      if (response.status === 200) {
        const { record_id } = payload;
        yield put({ type: 'saveTotal', payload: { [record_id]: data } });
      }
    },
  },
  reducers: {
    saveTotal(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
