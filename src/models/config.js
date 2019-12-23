import { query, update, patch } from '@/services/config';
import { Icon, notification } from 'antd';

const initDefault = {
  global: [],
  ali_sms: [],
  stream_reward: [],
  coin: [],
  usdt_rpc: [],
  recommend_content: [],
  about_us: [],
  agreement: [],
};

const Model = {
  namespace: 'systemConfig',
  state: {
    settings: JSON.parse(JSON.stringify(initDefault)),
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const { response, data } = yield call(query, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: data.list,
        });
      }
      if (callback) callback();
    },

    *patch({ payload, callback }, { call }) {
      const { response } = yield call(patch);
      if (response.status === 200) {
        notification.open({
          message: '更新配置缓存成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          duration: 1,
        });
      }
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      payload.map(setting => {
        setting.value += '';
        return setting;
      });
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        notification.open({
          message: '更新配置成功',
          icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
          description: '[更新缓存]才能立即对服务器生效',
          duration: 2,
        });
      }
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      let settings = JSON.parse(JSON.stringify(initDefault));
      for (let setting of action.payload) {
        if (typeof settings[setting.group] === 'object') {
          settings[setting.group].push(setting);
        }
      }
      return {
        ...state,
        settings,
      };
    },
  },
};
export default Model;
