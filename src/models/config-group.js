import { get, update } from '@/services/config-group';
import { Icon, message, notification } from 'antd';

const Model = {
  namespace: 'configGroup',
  state: {
    setting: {},
  },
  effects: {
    * get({ payload }, { call, put }) {
      const { data } = yield call(get, payload);
      yield put({
        type: 'save',
        payload: data,
      });
    },

    * update({ payload, callback }, { call, put }) {
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        notification.open({
          message: '更新配置成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>,
          duration: 1,
        });

        yield put({
          type: 'save',
          payload: payload,
        });
      }
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        setting: action.payload
      };
    },
  },
};
export default Model;
