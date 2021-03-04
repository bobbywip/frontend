import Web3 from "web3"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider";

import { WEB3SETTINGS } from "../config"

const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        pollingInterval: 900000000000000, //a long time, we don't need the block number that walletconnect fetches
        rpc: {
          1: WEB3SETTINGS.RPC_PROXY
        }
      }
    }
};

const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions
});

const initWeb3 = (provider) => {
    const web3 = new Web3(provider)

    web3.eth.extend({
        methods: [
          {
            name: "chainId",
            call: "eth_chainId",
            outputFormatter: web3.utils.hexToNumber
          }
        ]
      });
    
      return web3;
}

// Logic to return the correct contract addresses for the network
const getTokenAddresses = (chainId) => {
  let KNC_STAKING_ADDRESS;
  let KNC_TOKEN_ADDRESS;
  let KCSP_ADDRESS;
  let KNC_DAO_ADDRESS;

  switch(chainId) {
    case 1:
    default:
      KCSP_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.MAINNET.KCSP_ADDRESS
      KNC_STAKING_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.MAINNET.KNC.STAKING.ADDRESS
      KNC_TOKEN_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.MAINNET.KNC.TOKEN.ADDRESS
      KNC_DAO_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.MAINNET.KNC.DAO.ADDRESS
      break;
    case 3:
      KCSP_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.TESTNET.KCSP_ADDRESS
      KNC_STAKING_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.TESTNET.KNC.STAKING.ADDRESS
      KNC_TOKEN_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.TESTNET.KNC.TOKEN.ADDRESS
      KNC_DAO_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.TESTNET.KNC.DAO.ADDRESS
      break;
  }

  return { KNC_DAO_ADDRESS, KNC_STAKING_ADDRESS, KNC_TOKEN_ADDRESS, KCSP_ADDRESS }
}

// Logic to check for the tx to be mined
async function getTransactionReceiptMined(txHash, web3, interval) {
  const self = web3.eth;
  const transactionReceiptAsync = function(resolve, reject) {
      self.getTransactionReceipt(txHash, (error, receipt) => {
          if (error) {
              reject(error);
          } else if (receipt == null) {
              setTimeout(
                  () => transactionReceiptAsync(resolve, reject),
                  interval ? interval : 2000);
          } else {
              resolve(receipt);
          }
      });
  };

  if (Array.isArray(txHash)) {
      return Promise.all(txHash.map(
          oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
  } else if (typeof txHash === "string") {
      return new Promise(transactionReceiptAsync);
  } else {
      throw new Error("Invalid Type: " + txHash);
  }
}

export { web3Modal, initWeb3, getTokenAddresses, getTransactionReceiptMined }