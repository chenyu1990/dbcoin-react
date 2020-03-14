import { query, add, remove } from '@/services/attachment';

const Model = {
  namespace: 'attachment',
  state: {
    data: {},
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      console.log('debug fetch fuck')
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
    save(state, { payload }) {
      console.log('debug save', payload);
      return {
        ...state,
        data: { ...state.data, ...payload },
      };
    },
  },
};
export default Model;
