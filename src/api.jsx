const { NODE_ENV } = process.env;

let BASE_URL;
if (NODE_ENV === 'development') {
  BASE_URL = 'http://127.0.0.1:10088';
} else {
  const { origin } = window.location;
  BASE_URL = origin;
}
const ADMIN_URL = `${BASE_URL}/api/admin`;
const API_URL = `${BASE_URL}/api`;

export const PROFILE = {
  MAIN: `${ADMIN_URL}/v1/profile`,
  POINT: `${ADMIN_URL}/v1/profile/point`,
};
export const TRANSACTION_BLOCK = `${ADMIN_URL}/v1/transaction-block`;
export const TRANSACTION = `${ADMIN_URL}/v1/transaction`;
export const TransactionExcel = {
  Base: `${ADMIN_URL}/v1/transaction/excel`,
};
export const LOGGER = `${ADMIN_URL}/v1/logger`;

export const DATA = {
  ATTACHMENT: `${BASE_URL}/data/attachment`,
  Contract: `${BASE_URL}/data/contract`,
};

export const SYSTEM = {
  SETTING: `${ADMIN_URL}/v1/setting`,
  SETTING_GROUP: `${ADMIN_URL}/v1/setting-group`,
};

export const STAT = {
  MAIN: `${ADMIN_URL}/v1/stat`,
};

export const LEVEL = {
  MAIN: `${ADMIN_URL}/v1/level`,
};

export const FEEDBACK = {
  MAIN: `${ADMIN_URL}/v1/feedback`,
};

export const Wallet = {
  Base: `${ADMIN_URL}/v1/wallet`,
  Info: {
    Base: `${ADMIN_URL}/v1/wallet/info`,
    Btc: `${ADMIN_URL}/v1/wallet/info/btc`,
    Usdt: `${ADMIN_URL}/v1/wallet/info/usdt`,
  },
  Stat: `${ADMIN_URL}/v1/wallet/stat`,
  Address: {
    Base: `${ADMIN_URL}/v1/wallet/address`,
    Validate: `${ADMIN_URL}/v1/wallet/address/validate`,
  },
  Withdraw: {
    Base: `${ADMIN_URL}/v1/wallet/withdraw`,
    Btc: `${ADMIN_URL}/v1/wallet/withdraw/btc`,
    Usdt: `${ADMIN_URL}/v1/wallet/withdraw/usdt`,
  },
};

export const ARTICLE = {
  MAIN: `${ADMIN_URL}/v1/article`,
  GET: `${API_URL}/v1/article`,
};

export const MENU = {
  MAIN: `${ADMIN_URL}/v1/menu`,
  TREE: `${ADMIN_URL}/v1/menu.tree`,
};

export const ROLE = {
  MAIN: `${ADMIN_URL}/v1/role`,
};

export const ATTACHMENT = {
  MAIN: `${API_URL}/v1/attachment`,
  EDIT: `${ADMIN_URL}/v1/attachment`,
};

export const CONTRACT = {
  MAIN: `${ADMIN_URL}/v1/contract`,
  ORDER: {
    QUERY: `${ADMIN_URL}/v1/contract-order`,
    Excel: `${ADMIN_URL}/v1/contract-order/excel`,
  },
  PLAN: {
    QUERY: `${ADMIN_URL}/v1/contract-plan`,
  },
  QUERY: `${ADMIN_URL}/v1/contract`,
};

export const PUBLIC = {
  CAPTCHA: `${API_URL}/v1/public/captcha`,
};

export const AD = {
  QUERY: `${API_URL}/v1/banner`,
  EDIT: `${ADMIN_URL}/v1/banner`,
};

const ACCOUNT_BASE = '';
export const ACCOUNT = {
  LOGIN: `${API_URL}/v1/account/login`,
  LOGOUT: `${API_URL}/v1/account/logout`,
  INFO: `${API_URL}/v1/account`,
  MENU_TREE: `${ADMIN_URL}/v1/account/menu.tree`
};

export const USER = {
  MAIN: `${ADMIN_URL}/v1/user`,
};

export const STREAM = {
  MAIN: `${ADMIN_URL}/v1/stream`,
};
