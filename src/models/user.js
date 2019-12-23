import { queryCurrent, query, disable, enable, create, remove, update, get } from '@/services/user';
import { info } from '@/services/login';

const UserModel = {
  namespace: 'user',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    users: {},
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
    * fetchUser(_, { call, put }) {
      const response = yield call(info);
      yield put({
        type: 'saveUser',
        payload: response,
      });
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
        yield put({ type: 'global/requestSuccess', payload: { message: '新增用户成功' } });
        yield put({ type: 'fetch' });
        if (success) success();
      }
    },

    *remove({ payload, success }, { call, put }) {
      const { response } = yield call(remove, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: { message: '移除用户成功' } });
        yield put({ type: 'fetch' });
        if (success) success();
      }
    },

    *update({ payload, success }, { call, put }) {
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: { message: '更新用户成功' } });
        yield put({ type: 'fetch' });
        if (success) success();
      }
    },

    *enable({ payload, callback }, { call, put }) {
      const { response } = yield call(enable, payload);
      if (response.status === 200) {
        yield put({
          type: 'updateArr',
          payload: payload,
        });
      }
      if (callback) callback();
    },
    *disable({ payload, callback }, { call, put }) {
      const { response } = yield call(disable, payload);
      if (response.status === 200) {
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
        if (item.record_id === action.payload.record_id) {
          return action.payload;
        }
        return item;
      });
      return state;
    },
    addArr(state, action) {
      state.data.list.push(action.payload);
      return state;
    },
    save(state, action) {
      let users = {};
      action.payload.list.map(item => {
        users[item.record_id] = item;
      });
      return { ...state, data: action.payload, users };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
