/* eslint-disable */
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import * as config from '@/config';
import PriceFormatter from './priceFormatter';

ScatterJS.plugins(new ScatterEOS());

// const account = 'signature.bp';
const currentNetwork = config.network.eos.mainnet[0];
// api https://get-scatter.com/docs/api-create-transaction

// @trick: use function to lazy eval Scatter eos, in order to avoid no ID problem.
const eos = () => ScatterJS.scatter.eos(currentNetwork, Eos, { expireInSeconds: 60 });
const currentEOSAccount = () => ScatterJS.scatter.identity && API.getAccount();

const eosClient = Eos({
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  httpEndpoint: "https://proxy.eosnode.tools",
});

const API = {
  authSignature() {
    return new Promise((resolve, reject) => {
      const { getAccount, getArbitrarySignature } = this;
      const account = getAccount();
      eosClient.getAccount(account.name).then((result) => {
        // 获取当前权限
        const permissions = result.permissions.find(x => x.perm_name === account.authority);
        // 获取当前权限的public key
        const publicKey = permissions.required_auth.keys[0].key;
        // 需要签名的数据
        const signData = account.name;
        // 申请签名
        getArbitrarySignature(publicKey, signData, 'Auth')
        .then(signature => { resolve({ publicKey, signature, username: account.name }); })
        .catch(error => reject(error));
      });
    });
  },

  getSignature(author, hash) {
    return new Promise((resolve, reject) => {
      const { getAccount, getArbitrarySignature } = this;
      const account = getAccount();
      eosClient.getAccount(account.name).then((result) => {
        // 获取当前权限
        const permissions = result.permissions.find(x => x.perm_name === account.authority);
        // 获取当前权限的public key
        const publicKey = permissions.required_auth.keys[0].key;
        // 需要签名的数据
        const hashPiece1 = hash.slice(0, 12);
        const hashPiece2 = hash.slice(12, 24);
        const hashPiece3 = hash.slice(24, 36);
        const hashPiece4 = hash.slice(36, 48);
        const signData = `${author} ${hashPiece1} ${hashPiece2} ${hashPiece3} ${hashPiece4}`;
        // 申请签名
        getArbitrarySignature(publicKey, signData, 'Smart Signature')
        .then(signature => { resolve({ publicKey, signature, username: account.name }); })
        .catch(error => { reject(error); });
      });
    });
  },

  async getBalancesByContract({ tokenContract = 'eosio.token', accountName, symbol }) {
    return eos().getCurrencyBalance(tokenContract, accountName, symbol);
  },
  install(Vue) {
    Object.defineProperties(Vue.prototype, {
      $API: {
        get() {
          return API;
        },
      },
    });
  },
  connectScatterAsync() {
    return ScatterJS.scatter.connect(config.dappName, { initTimeout: 2000 });
  },
  suggestNetworkAsync() {
    return ScatterJS.scatter.suggestNetwork(currentNetwork);
  },
  loginScatterAsync() {
    const requiredFields = { accounts: [currentNetwork] };
    return ScatterJS.scatter.getIdentity(requiredFields);
  },
  logoutScatterAsync() {
    return ScatterJS.scatter.forgetIdentity();
  },
  transferEOSAsync({
    to,
    memo = '',
    amount = 0,
  }) {
    return eos().transfer(
      currentEOSAccount().name,
      to,
      PriceFormatter.formatPrice(amount),
      memo, {
        authorization: [`${currentEOSAccount().name}@${currentEOSAccount().authority}`],
      },
    );
  },
  async transferTokenAsync({
    to,
    memo = '',
    amount = 0,
    tokenContract = 'eosio.token',
  }) {
    const contract = await eos().contract(tokenContract);

    return contract.transfer(
      currentEOSAccount().name,
      to,
      amount,
      memo, {
        authorization: [`${currentEOSAccount().name}@${currentEOSAccount().authority}`],
      },
    );
  },
  getAccount() {
    return ScatterJS.scatter.identity.accounts.find(x => x.blockchain === 'eos');
  },
  getArbitrarySignature(publicKey, data, memo) { 
    return ScatterJS.scatter.getArbitrarySignature(publicKey, data, memo);
  },
  getPublicKey() {
    return ScatterJS.scatter.getPublicKey('eos').then((publicKey) => {
      console.log(publicKey);
      return publicKey;
    }).catch((error) => {
      // todo(minakokojima): better error message.
      alert(error);
    });
  },
};


export default API;
export { eos, currentEOSAccount };
