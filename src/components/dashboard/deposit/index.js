import React, { useContext, useState } from "react"
import styled from "styled-components"

import { WEB3SETTINGS, KNC_STAKING_ABI, KNC_TOKEN_ABI } from "../../../config"
import { AppStateContext } from "../../layout"

import { PrimaryButton } from '../../common/buttons'
import Ticker from '../../common/ticker'
import Tooltip from '../../common/tooltip'

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
const DepositButton = styled(PrimaryButton)`
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

const UserHasApprovedTokenSpend = async(amount, address, networkId, web3) => {
    const { KNC_STAKING_ADDRESS, KNC_TOKEN_ADDRESS } = getTokenAddresses(networkId)

    if(web3 === null) {
        console.log(`no web3 object - cannot SendKncTokensToStakeContract`)
        return
    }

    const tokenContract = await new web3.eth.Contract(KNC_TOKEN_ABI, KNC_TOKEN_ADDRESS)
    // Check the allowance for transferFrom - does the stake contract have a token allowance to spend from the user address?
    const allowance = await tokenContract.methods.allowance(address, KNC_STAKING_ADDRESS).call((error, balance) => {
        return balance
    })

    if(amount === 0 && allowance === 0) {
        console.log(`We need to call allowance - amount:0 allowance:0`)
        return false
    }

    if(allowance === 0 || parseInt(allowance) < parseInt(amount)) {
        console.log(`We need to call allowance - amount:${parseInt(amount)} allowance:${parseInt(allowance)}`)
        return false
    }

    return true
}

// Logic to handle deposting KNC into the staking pool
const SendKncTokensToStakeContract = async(amount, address, networkId, web3) => {

    if(web3 === null) {
      console.log(`no web3 object - cannot SendKncTokensToStakeContract`)
      return
    }

    const { KNC_STAKING_ADDRESS, KNC_TOKEN_ADDRESS } = getTokenAddresses(networkId)
  
    const stakeContract = await new web3.eth.Contract(KNC_STAKING_ABI, KNC_STAKING_ADDRESS)
    const tokenContract = await new web3.eth.Contract(KNC_TOKEN_ABI, KNC_TOKEN_ADDRESS)

    const amountToStake = web3.utils.toBN(amount)
    const calculatedAmountToDeposit = web3.utils.toHex(amountToStake * 1e18)
  
    const hasUserApproved = await UserHasApprovedTokenSpend(amount, address, networkId, web3)

    if(!hasUserApproved) {
        const infinity = '999999999999999999999999999999999999999999'; //TODO - Make this a set amount or infinity?
        await tokenContract.methods.approve(KNC_STAKING_ADDRESS, infinity).send({from: address}, function(e) {
            console.log(e)
        })
    }
  
    // Now send the KNC tokens to the contract
    await stakeContract.methods.deposit(calculatedAmountToDeposit).send({from: address}, function(e) {
      console.log(e)
    })
}

export default function Deposit() {
    const context = useContext(AppStateContext)
    const [depositAmount, setDepositAmount] = useState(0)
    const [depositOrAllowAction, setDepositOrAllowAction] = useState({name: "Deposit"})

    const balance = context && context.assets[0] && context.assets[0].knc > 0 ? context.assets[0].knc : null
    const maxInput = balance === null ? 0 : balance

    if(depositAmount > 0) {
        UserHasApprovedTokenSpend(depositAmount, context.address, context.networkId, context.web3).then((res) => {
            if(res) {
                setDepositOrAllowAction({name: "Deposit"})
                return
            }

            setDepositOrAllowAction({name: "Approve KNC"})
        })
    }

    return (
        <Container>
            <Title>
                <Tooltip text="This is the amount of KNC you have in your wallet that is not staked" />
                Total KNC Balance
            </Title>
            <Description>
                {
                    balance === null 
                        ?
                            <DefaultDescription>
                                You have no KNC tokens yet.
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
            <Title>Deposit</Title>
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
                    onChange={(e) => setDepositAmount(e.target.value)}
                />
                <DepositButton 
                  disabled={depositAmount === 0 || depositAmount === null ? true : false}
                  onClick={() => SendKncTokensToStakeContract(depositAmount, context.address, context.networkId, context.web3)}
                >
                    {
                        depositOrAllowAction.name
                    }
                </DepositButton>
            </InputContainer>
        </Container>
    )
}
