import React, { useContext } from "react";
import styled from "styled-components";

import { WEB3SETTINGS } from '../../../config' 
import { AppStateContext } from '../../layout'

const Container = styled.div`
    width: 100%;
    margin: 0.5em 0;
`
const Options = styled.ul`
    list-style-type: none;
    text-align: center;
    margin: 0;
    padding: 0;
`
const Item = styled.li`
    font-size: 10pt;
    display: inline-block;
    border: 1px solid #222;
    padding: 0.5em;
    margin: 0;
    display: none;

    ${props => props.selected && `
        background: #222;
        color: #FFF;
        display: inline-block;
    `}
`

export default function NetworkToggle() {
  const { chainId } = useContext(AppStateContext);

  return (
    <Container>
        <Options>
            <Item 
                selected={chainId === 1}
            >{WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.MAINNET.CHAIN_NAME}</Item>
            <Item
                selected={chainId === 3}
            >{WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.TESTNET.CHAIN_NAME}</Item>
        </Options>
    </Container>
  )
}