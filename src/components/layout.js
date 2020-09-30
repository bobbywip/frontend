import React, { Component, createContext } from "react"
import styled from "styled-components"

import Header from "./common/header"
import Footer from  "./common/footer"
import { NetworkToggle, UnsupportedNetwork, isUnsupportedChainId } from './common/network'

import { web3Modal, initWeb3 } from "../utils/web3"

import { Socials, WEB3SETTINGS, KNC_TOKEN_ABI } from "../config"

const Container = styled.div`
    overflow-x: hidden;
    margin: 0;
    font-family: Helvetica Neue;
    font-style: normal;
`

const INITIAL_STATE = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  stake: [],
  showModal: false,
  pendingRequest: false,
  result: null,
  pendingTokenApproval: false
}

export const AppStateContext = createContext(null)

export default class Layout extends Component {

  constructor() {
    super()

    this.state = {
      ...INITIAL_STATE
    }

    this.web3Modal = web3Modal
  }

  componentDidMount() {
    if (web3Modal.cachedProvider) {
      this.onConnect()
    }
  }

  onConnect = async () => {
    const provider = await web3Modal.connect();

    await this.subscribeProvider(provider);

    const web3 = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId
    });

    if(isUnsupportedChainId(this.state.chainId)) {
      return
    }

    await this.getAccountAssets()
  };

  subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }

    provider.on("close", () => this.resetApp());

    provider.on("accountsChanged", async (accounts) => {
      await this.setState({ address: accounts[0] });
      await this.getAccountAssets();
    });

    provider.on("chainChanged", async (chainId) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });

    provider.on("networkChanged", async (networkId) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });
  }

  getAccountAssets = async () => {
    const { address, web3 } = this.state;
    this.setState({ fetching: true });

    try {
      // get account balances (eth)
      const assets_eth = await web3.eth.getBalance(address)

      let KNC_TOKEN_CONTRACT_ADDRESS;
      switch(this.state.networkId) {
        case 1:
        default:
          KNC_TOKEN_CONTRACT_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.MAINNET.KNC.TOKEN.ADDRESS
          break;
        case 3:
          KNC_TOKEN_CONTRACT_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.TESTNET.KNC.TOKEN.ADDRESS
          break;
      }

      const contract = await new web3.eth.Contract(KNC_TOKEN_ABI, KNC_TOKEN_CONTRACT_ADDRESS)
      const assets_knc = await contract.methods.balanceOf(address).call((error, balance) => {
        return balance
      })

      const assets = [{
        eth: assets_eth/1e18,
        knc: assets_knc/1e18
      }]

      await this.setState({ 
        fetching: false, 
        assets
      });
    } catch (error) {
      console.log(error)
      await this.setState({ fetching: false });
    }

  };

  resetApp = async () => {
    const { web3 } = this.state;

    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }

    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });

  };

  render() {
    return (
      <AppStateContext.Provider value={this.state}>
        {
          isUnsupportedChainId(this.state.chainId)
            ? <UnsupportedNetwork />
            :
              <Container>
                  <Header 
                    connectToWeb3={this.onConnect}
                    disconnectWeb3={this.resetApp}
                  />
                  {this.props.children}
                  <Footer 
                    socials={Socials}
                  />
                  <NetworkToggle 
                    callback={this.changeSelectedNetwork}
                  />
              </Container>
          }
      </AppStateContext.Provider>
    )
  }

}
