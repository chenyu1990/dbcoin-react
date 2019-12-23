import request from '@/utils/request';
import * as API from '@/api';

export async function stat(params) {
  return request(API.Wallet.Stat, {
    method: 'GET',
    params,
  });
}

export async function btcWalletBalances() {
  return request(API.Wallet.Info.Btc);
}

export async function usdtWalletBalances() {
  return request(API.Wallet.Info.Usdt);
}

export async function validateAddress(params) {
  return request(API.Wallet.Address.Validate, {
    method: 'GET',
    params,
  });
}

export async function withdrawBtc(params) {
  return request(API.Wallet.Withdraw.Btc, {
    method: 'GET',
    params,
  });
}

export async function withdrawUsdt(params) {
  return request(API.Wallet.Withdraw.Usdt, {
    method: 'GET',
    params,
  });
}
