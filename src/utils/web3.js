import Web3 from "web3"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider";

import { WEB3SETTINGS } from "../config"

const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: WEB3SETTINGS.INFURA.ID
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

export { web3Modal, initWeb3 }