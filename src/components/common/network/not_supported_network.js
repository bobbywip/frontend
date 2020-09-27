import React, { useContext } from "react";
import styled from "styled-components";

import { WEB3SETTINGS } from '../../../config' 
import { AppStateContext } from '../../layout'
import { default as ChainInfo } from './chains.json'

import WarningGraphic from '../../../static/warning.png'

const Container = styled.div`
    position: fixed;
    background: #F8F8F8;
    height: 100vh;
    width: 100vw;
    margin: 0;
    overflow: hidden;
    z-index: 999;
    text-align: center;
    display: grid;
    place-items: center;
`
const ErrorContainer = styled.div`
    display: inline-block;
`
const Icon = styled.img`
    height: 64px;
    width: 64px;
`
const Heading = styled.h3`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
`
const Text = styled.p`
    font-family: Helvetica Neue;
    font-size: 16px;
`

const chainIdToName = _chainId => {
    const chain = ChainInfo.filter((chain) => {
        return chain.chainId === _chainId
    })

    if(chain) {
        return chain[0].name
    }

    return "Unknown"
}

export const isUnsupportedChainId = chainId => {
    const keys = Object.keys(WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG)

    const config = keys.filter((key) => {
        return WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG[key].CHAIN_ID === chainId
    })

    return config.length > 0 ? false : true
}

export default function UnsupportedNetwork() {
    const { chainId } = useContext(AppStateContext);

    return (
        <Container>
            <ErrorContainer>
                <Icon src={WarningGraphic} alt="Warning Image" />
                <Heading>Unsupported Network!</Heading>
                <Text>
                    {chainIdToName(chainId)} is not a supported network with KCSP!
                </Text>
                <Text>
                    Please switch your provider to Mainnet or Ropsten!
                </Text>
            </ErrorContainer>
        </Container>
    )
}