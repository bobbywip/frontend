import React from "react"
import styled from "styled-components"
import { AppStateContext } from "../../layout"

import Ticker from '../../common/ticker'
import Tooltip from '../../common/tooltip'

import LogoEthereum from '../../../static/coins/eth.png'
import LogoKyber from '../../../static/coins/kyber.png'

const Container = styled.div`
    background: #FFFFFF;
    border-radius: 16px;
    color: #000;
    padding: 2em;
    margin: 1em 1em 1em 0;
    flex: 0 1 460px;
    max-height: 228px;

    @media (max-width: 650px) {
        flex: 1 1 100%;
    }
`
const HeaderContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 2em 0;
`
const Title = styled.div`
    flex: 0 1 55%;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.1px;
    color: #000000;
`
const BodyContainer = styled.div`
    margin: 0 2em;
    display: flex;
    flex-wrap: wrap;
`
const CoinContainer = styled.div`
    display: block;
    margin: 0 2em;

    &:nth-child(1) {
        padding-right: 3em;
        border-right: 2px solid #E5E5E5;
    }
`
const Image = styled.img`
    text-align: center;
    height: 32px;
    width: 25px;
    display: block;
    margin: 0.5em;
`

export default function Portfolio() {
    return (
        <Container>
            <HeaderContainer>
                <Title>
                    <Tooltip text="This panel detail your holdings in your wallet" />
                    Portfolio Balance
                </Title>
            </HeaderContainer>
            <BodyContainer>
                <CoinContainer>
                    <Image src={LogoEthereum} />
                    <AppStateContext.Consumer>
                        {
                            context => {
                                return(
                                    context.assets[0] && context.assets[0].eth > 0
                                        ?
                                            (context.assets[0].eth % 1 !== 0) 
                                                ? (context.assets[0].eth).toFixed(4)
                                                : (context.assets[0].eth) 
                                        : 
                                            0
                                )
                            }
                        }
                    </AppStateContext.Consumer>
                    {' '} <Ticker ticker="ETH" />
                </CoinContainer>

                <CoinContainer>
                    <Image src={LogoKyber} />
                    <AppStateContext.Consumer>
                        {
                            context => {
                                return(
                                    context.assets[0] && context.assets[0].knc > 0
                                        ?
                                            (context.assets[0].knc % 1 !== 0) 
                                                ? (context.assets[0].knc).toFixed(4)
                                                : (context.assets[0].knc) 
                                        : 
                                            0
                                )
                            }
                        }
                    </AppStateContext.Consumer>
                    {' '} <Ticker ticker="KNC" />
                </CoinContainer>
            </BodyContainer>
        </Container>
    )
}
