import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"

import { KNC_STAKING_ABI, KNC_TOKEN_ABI } from "../../../config"
import { AppStateContext } from "../../layout"
import { getTokenAddresses, getTransactionReceiptMined } from "../../../utils/web3"
import { formatNumberToHuman } from "../../../utils/numbers"

import { PrimaryButton } from '../../common/buttons'
import Ticker from '../../common/ticker'
import Tooltip from '../../common/tooltip'
import TxPending from '../../common/txpending'

const Container = styled.div`
    background: #FFF;
    border-radius: 16px;
    color: #000;
    padding: 2em 2em 0.25em 2em;
    margin: 0.5em 1em 0.5em 0;
    flex: 0 1 200px;

    @media (max-width: 650px) {
        flex: 1 1 100%;
    }

    ${props => props.pendingTx && 
        `
            opacity: 0.5;

            &:hover {
                cursor: not-allowed;
            }
        `
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
    position: relative;
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
const FullNumber = styled.div`
    display: block;
    font-size: 10pt;
    color: #a9a9a9;
`
const DepositButton = styled(PrimaryButton)`
    margin-top: 1rem;

    ${props => props.disabled &&
        `
            opacity: 0.5;
            &:hover {
                cursor: not-allowed;
            }
        `
    }
`
const MaxInputButton = styled.button`
    position: absolute;
    float: right;
    right: 1.5rem;
    top: 16%;
    height: 22px;
    background: #FFD02A;
    border: none;

    &:hover {
        cursor: pointer;
    }
`

export default function Deposit() {
    const context = useContext(AppStateContext)
    const [depositAmount, setDepositAmount] = useState(0)
    const [kncBalance, setKncBalance] = useState(0)
    const [isTxMining, setIsTxMining] = useState(false)
    const [txHash, setTxHash] = useState(0)
    const [depositOrAllowAction, setDepositOrAllowAction] = useState({name: "Deposit"})

    // Logic to handle deposting KNC into the staking pool
    const SendKncTokensToStakeContract = async(amount) => {
        const { address, chainId, web3 } = context

        if(web3 === null) {
            console.log(`no web3 object - cannot SendKncTokensToStakeContract`)
            return
        }

        const { KNC_STAKING_ADDRESS, KNC_TOKEN_ADDRESS } = getTokenAddresses(chainId)
    
        const stakeContract = await new web3.eth.Contract(KNC_STAKING_ABI, KNC_STAKING_ADDRESS)
        const tokenContract = await new web3.eth.Contract(KNC_TOKEN_ABI, KNC_TOKEN_ADDRESS)

        const amountToStake = web3.utils.toBN(amount * 1e18)
        const calculatedAmountToDeposit = web3.utils.toHex(amountToStake)
    
        const hasUserApproved = await UserHasApprovedTokenSpend(amount)

        if(!hasUserApproved) {
            const infinity = '999999999999999999999999999999999999999999'; //TODO - Make this a set amount or infinity?
            await tokenContract.methods.approve(KNC_STAKING_ADDRESS, infinity).send({from: address}, async function(err, txHash) {
                console.log(err)

                if(!err) {
                    console.log(`TxHash: ${txHash}`)
                    setIsTxMining(true)
                    setTxHash(txHash)
                    const receipt = await getTransactionReceiptMined(txHash, web3)
                    console.log(receipt)
                }
            })
        }
    
        // Now send the KNC tokens to the contract
        await stakeContract.methods.deposit(calculatedAmountToDeposit).send({from: address}, async function(err, txHash) {
            console.log(err)

            if(!err) {
                console.log(`TxHash: ${txHash}`)
                setIsTxMining(true)
                setTxHash(txHash)
                const receipt = await getTransactionReceiptMined(txHash, web3)
                console.log(receipt)

                // Reset everything and refetch chain details
                setKncBalance(balance - amount)
                setIsTxMining(false)
                setTxHash(false)
            }
        })
    }

    // Logic to check if the user has approved the KNC token
    const UserHasApprovedTokenSpend = async(amount) => {
        const { address, chainId, web3 } = context
        const { KNC_STAKING_ADDRESS, KNC_TOKEN_ADDRESS } = getTokenAddresses(chainId)
    
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

    // Logic to fetch the users knc balance
    const GetUserTokenBalance = async() => {
        const { web3, chainId, address } = context

        if(web3 === null) {
            console.log(`no web3 object - cannot GetUserTokenBalance`)
            return
        }

        const { KNC_TOKEN_ADDRESS } = getTokenAddresses(chainId)

        const contract = await new web3.eth.Contract(KNC_TOKEN_ABI, KNC_TOKEN_ADDRESS)
        const balance = await contract.methods.balanceOf(address).call((error, balance) => {
          return balance
        })

        if(balance) {
            setKncBalance(balance)
        }
    }

    useEffect(() => {

        async function doStuff() {
            await GetUserTokenBalance()
        }

        doStuff()
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTxMining])

    GetUserTokenBalance()
    const balance = kncBalance > 0 ? kncBalance/1e18 : null
    const maxInput = balance === null ? 0 : balance

    const { web3 } = context;

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
        <Container pendingTx={isTxMining}>
            <Title>
                <Tooltip text="This is the amount of KNC you have in your wallet that is not staked" />
                Total KNC Balance
            </Title>
            <Description>
                {
                    !web3 || balance === null 
                        ?
                            <DefaultDescription>
                                You have no KNC tokens yet.
                            </DefaultDescription>
                        :
                            <KncContainer>
                                {formatNumberToHuman(balance)} 
                                <Ticker
                                    ticker="KNC"
                                />
                                <FullNumber>{balance}</FullNumber>
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
                    value={depositAmount > 0 ? depositAmount : 0}
                />
                <MaxInputButton onClick={() => setDepositAmount(maxInput)}>
                    MAX
                </MaxInputButton>
                <DepositButton 
                  disabled={!!depositAmount === false || isTxMining ? true : false}
                  onClick={() => SendKncTokensToStakeContract(depositAmount, context.address, context.networkId, context.web3)}
                >
                    {
                        depositOrAllowAction.name
                    }
                </DepositButton>
                {
                    isTxMining && <TxPending hash={txHash.toString()} />
                }
            </InputContainer>
        </Container>
    )
}
