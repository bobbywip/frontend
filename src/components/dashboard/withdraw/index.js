import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

import { WEB3SETTINGS, KNC_STAKING_ABI, KNC_TOKEN_ABI } from "../../../config"
import { AppStateContext } from "../../layout"

import { PrimaryButton } from '../../common/buttons'
import Ticker from '../../common/ticker'
import Tooltip from '../../common/tooltip'

Withdraw.propTypes = {

}

const Container = styled.div`
    background: #FFF;
    border-radius: 16px;
    color: #000;
    padding: 2em;
    margin: 1em 1em 1em 0;
    flex: 0 1 200px;

    @media (max-width: 650px) {
        flex: 1 1 100%;
    }
`
const Title = styled.div`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.1px;
    color: #000000;
`
const Description = styled.div`
    text-align: center;
    height: 150px;
    margin: 2em 0.5em 0;
`
const DefaultDescription = styled.div`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.1px;
    color: #BDBDBD;
`
const Separator = styled.hr`
    width: 100%;
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #E5E5E5, #E9E9E9, #E5E5E5);
    margin: 0 0 2em 0;
`
const InputContainer = styled.div`
    display: grid;
    place-items: center;
`
const Input = styled.input`
    padding: 1em;
    margin: 0.5em 0;
    border: 1px solid #BDBDBD;
    border-radius: 5px;
    display: block;
    width: 100%;
`
const KncContainer = styled.div`
    display: inline-block;
    font-size: 68px;
    text-align: center;
`
const WithdrawButton = styled(PrimaryButton)`
    ${props => props.disabled &&
        `
            opacity: 0.5;
            &:hover {
                cursor: not-allowed;
            }
        `
    }
`

const getTokenAddresses = (networkId) => {
    let KNC_STAKING_ADDRESS;
    let KNC_TOKEN_ADDRESS;
    switch(networkId) {
      case 1:
      default:
        KNC_STAKING_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.MAINNET.KNC.STAKING.ADDRESS
        KNC_TOKEN_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.MAINNET.KNC.TOKEN.ADDRESS
        break;
      case 3:
        KNC_STAKING_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.TESTNET.KNC.STAKING.ADDRESS
        KNC_TOKEN_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.TESTNET.KNC.TOKEN.ADDRESS
        break;
    }

    return { KNC_STAKING_ADDRESS, KNC_TOKEN_ADDRESS }
}

// Logic to handle withdrawing KNC from the staking pool
const WithdrawKncTokensFromStakeContract = async(amount, address, networkId, web3) => {

    if(web3 === null) {
      console.log(`no web3 object - cannot SendKncTokensToStakeContract`)
      return
    }

    const { KNC_STAKING_ADDRESS } = getTokenAddresses(networkId)

    const stakeContract = await new web3.eth.Contract(KNC_STAKING_ABI, KNC_STAKING_ADDRESS)

    const amountToWithdraw = web3.utils.toBN(amount)
    const calculatedAmountToWithdraw = web3.utils.toHex(amountToWithdraw * 1e18)

    // Now withdraw the KNC tokens to the contract
    await stakeContract.methods.withdraw(calculatedAmountToWithdraw).send({from: address}, function(e) {
        console.log(e)
    })
}

export default function Withdraw() {
    const context = useContext(AppStateContext)
    const [withdrawAmount, setWithdrawAmount] = useState(0)

    const balance = context && context.stake && context.stake.stake > 0 ? context.stake.stake/1e18 : null
    const maxInput = balance === null ? 0 : balance

    return (
        <Container>
            <Title>
                <Tooltip text="This is the amount of KNC tokens you have in the KNC staking contract" />
                KNC in Pool
            </Title>
            <Description>
                {
                    balance === null 
                        ?
                            <DefaultDescription>
                                You have no tokens in the pool yet. First you have to deposit KNC tokens.
                            </DefaultDescription>
                        :
                            <KncContainer>
                                {
                                    balance > 999 
                                    ? 
                                        Math.sign(balance) * ((Math.abs(balance)/1000).toFixed(1)) + `k`
                                    :
                                        (Math.sign(balance) * Math.abs(balance)).toFixed(0)
                                } 
                                <Ticker
                                    ticker="KNC"
                                />
                            </KncContainer>
                }
            </Description>
            <Separator />
            <Title>Withdraw</Title>
            <InputContainer>
                <Input 
                    type="number"
                    placeholder="KNC amount"
                    name="input"
                    max={maxInput}
                    min={0}
                    autocomplete="off"
                    disabled={
                        maxInput === 0 ? "disabled" : ""
                    }
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <WithdrawButton 
                  disabled={withdrawAmount ==0 || withdrawAmount === null ? true : false}
                  onClick={() => WithdrawKncTokensFromStakeContract(withdrawAmount, context.address, context.networkId, context.web3)}
                >
                    Withdraw
                </WithdrawButton>
            </InputContainer>
        </Container>
    )
}
