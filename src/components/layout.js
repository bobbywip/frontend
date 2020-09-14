import React, { Component, createContext } from "react"
import styled from "styled-components"

import Header from "./common/header"
import Footer from  "./common/footer"

import { web3Modal, initWeb3 } from "../utils/web3"

import { Socials, Web3Settings, KNC_TOKEN_ABI, KNC_STAKING_ABI } from "../config"

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
  result: null
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

    await this.getAccountAssets()
    await this.getStakeDetails()
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

      const contract = await new web3.eth.Contract(KNC_TOKEN_ABI, Web3Settings.CONTRACT.KNC_TOKEN.ADDRESS)
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

  getStakeDetails = async() => {
    const { address, web3 } = this.state;
    this.setState({ fetching: true });

    try {
      // get stake details
      const contract = await new web3.eth.Contract(KNC_STAKING_ABI, Web3Settings.CONTRACT.KNC_STAKING.ADDRESS)
      const stake = await contract.methods.getLatestStakerData(address).call((error, data) => {
        return data
      })

      const data = {
        delegatedStake: stake.delegatedStake,
        representative: stake.representative,
        stake: stake.stake
      }

      await this.setState({ 
        fetching: false, 
        stake: data
      });
    } catch (error) {
      console.log(error)
      await this.setState({ fetching: false });
    }
  }

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
      <Container>
        <AppStateContext.Provider value={this.state}>
          <Header 
            connectToWeb3={this.onConnect}
            disconnectWeb3={this.resetApp}
          />
          {this.props.children}
          <Footer 
            socials={Socials}
          />
        </AppStateContext.Provider>
      </Container>
    )
  }

}
