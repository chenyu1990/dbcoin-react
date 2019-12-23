import { create, get, query, remove, update } from '@/services/role';

const Model = {
  namespace: 'role',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    treeData: [],
  },
  effects: {
    *fetch({ payload, success }, { call, put }) {
      const { response, data } = yield call(query, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: data,
        });
        if (success) success(data.list);
      }
    },

    *get({ payload, success }, { call }) {
      const { response, data } = yield call(get, payload);
      if (response.status === 200) {
        if (success) success(data);
      }
    },

    *add({ payload, success }, { call, put }) {
      const { response } = yield call(create, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: { message: '新增角色成功' } });
        yield put({ type: 'fetch' });
        if (success) success();
      }
    },

    *remove({ payload, success }, { call, put }) {
      const { response } = yield call(remove, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: { message: '移除角色成功' } });
        yield put({ type: 'fetch' });
        if (success) success();
      }
    },

    *update({ payload, success }, { call, put }) {
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: { message: '更新角色成功' } });
        yield put({ type: 'fetch' });
        if (success) success();
      }
    },
  },
  reducers: {
    updateData(state, { payload }) {
      const { data } = state;
      data.list = data.list.map(item => {
        if (item.record_id === payload.record_id) {
          return payload;
        }
        return item;
      });
      return {
        ...state,
        data
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
};
export default Model;
