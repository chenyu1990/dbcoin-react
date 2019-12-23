import { query, add, remove } from '@/services/attachment';

const Model = {
  namespace: 'attachment',
  state: {
    data: {},
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const { response, data } = yield call(query, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: {
            [payload.related_id]: data.list,
          },
        });
      }
      if (callback) callback(response);
    },

    *add({ payload, callback }, { put, call }) {
      const { response, data } = yield call(add, payload);
      if (response.status === 200) {
        yield put({
          type: 'addArr',
          payload: {
            related_id: data.related_id,
            data: data,
          },
        });
      }
      if (callback) {
        callback({
          response,
          data,
        });
      }
    },
  },
  reducers: {
    addArr(state, action) {
      const { related_id, data } = action.payload;
      state.data[related_id].list.unshift(data);
      return state;
    },
    save(state, action) {
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    },
  },
};
export default Model;
