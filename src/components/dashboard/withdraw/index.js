import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"

import { KNC_STAKING_ABI } from "../../../config"
import { AppStateContext } from "../../layout"
import { getTokenAddresses, getTransactionReceiptMined } from "../../../utils/web3"
import { formatNumberToHuman } from "../../../utils/numbers"

import { PrimaryButton, SecondaryButton } from '../../common/buttons'
import Ticker from '../../common/ticker'
import Tooltip from '../../common/tooltip'
import TxPending from '../../common/txpending'

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
const DelegateContainer = styled.div`
    display: block;
    padding: 1em 0;
`
const DelegateButton = styled(SecondaryButton)`
    font-size: 9pt;
    background: #FFD02A;
    border: 1px solid #FFD02A;

    ${props => props.disabled &&
        `
            opacity: 0.5;
            &:hover {
                cursor: not-allowed;
            }
        `
    }
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

export default function Withdraw() {
    const context = useContext(AppStateContext)
    const [stakeDetails, setStakeDetails] = useState({delegatedStake: null, representative: null, stake: null})
    const [withdrawAmount, setWithdrawAmount] = useState(0)
    const [isTxMining, setIsTxMining] = useState(false)
    const [txHash, setTxHash] = useState(0)

    // Logic to handle withdrawing KNC from the staking pool
    const WithdrawKncTokensFromStakeContract = async(amount) => {
        const { address, chainId, web3 } = context

        if(web3 === null) {
            console.log(`no web3 object - cannot SendKncTokensToStakeContract`)
            return
        }

        const { KNC_STAKING_ADDRESS } = getTokenAddresses(chainId)

        const stakeContract = await new web3.eth.Contract(KNC_STAKING_ABI, KNC_STAKING_ADDRESS)

        const amountToWithdraw = web3.utils.toBN(amount * 1e18)
        const calculatedAmountToWithdraw = web3.utils.toHex(amountToWithdraw)

        // Now withdraw the KNC tokens to the contract
        await stakeContract.methods.withdraw(calculatedAmountToWithdraw).send({from: address}, async function(err, txHash) {
            console.log(err)

            if(!err) {
                console.log(`TxHash: ${txHash}`)
                setIsTxMining(true)
                setTxHash(txHash)
                const receipt = await getTransactionReceiptMined(txHash, web3)
                console.log(receipt)

                // Reset everything and refetch chain details
                setStakeDetails({
                    delegatedStake: stakeDetails.delegatedStake,
                    representative: stakeDetails.representative,
                    stake: stakeDetails.stake - amount
                })
                setWithdrawAmount(0)
                setIsTxMining(false)
                setTxHash(false)
            }
        })
    }

    // Logic to give voting power to KCSP
    const DelegateVotingPower = async() => {
        const { address, chainId, web3 } = context

        if(web3 === null) {
            console.log(`no web3 object - cannot SendKncTokensToStakeContract`)
            return
        }

        const { KCSP_ADDRESS, KNC_STAKING_ADDRESS } = getTokenAddresses(chainId)

        const stakeContract = await new web3.eth.Contract(KNC_STAKING_ABI, KNC_STAKING_ADDRESS)

        // Now give the voting power to KCSP
        await stakeContract.methods.delegate(KCSP_ADDRESS).send({from: address}, async function(err, txHash) {
            console.log(err)

            if(!err) {
                console.log(`TxHash: ${txHash}`)
                setIsTxMining(true)
                const receipt = await getTransactionReceiptMined(txHash, web3)
                console.log(receipt)

                // Reset everything and refetch chain details
                setStakeDetails({
                    delegatedStake: stakeDetails.delegatedStake,
                    representative: KCSP_ADDRESS,
                    stake: stakeDetails.stake
                })
                setWithdrawAmount(0)
                setIsTxMining(false)
            }
        })
    }

    // Logic to fetch the users stake balance
    const GetUserStakeDetails = async() => {
        const { web3, chainId, address } = context

        if(web3 === null) {
            console.log(`no web3 object - cannot GetUserStakeDetails`)
            return
        }

        const { KNC_STAKING_ADDRESS } = getTokenAddresses(chainId)

        const contract = await new web3.eth.Contract(KNC_STAKING_ABI, KNC_STAKING_ADDRESS)
        const stake = await contract.methods.getLatestStakerData(address).call((error, data) => {
            return data
        })

        setStakeDetails({
            delegatedStake: stake.delegatedStake,
            representative: stake.representative,
            stake: stake.stake
        })
    }

    useEffect(() => {

        async function doStuff() {
            await GetUserStakeDetails()
        }

        doStuff()
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTxMining])

    GetUserStakeDetails()
    const balance = stakeDetails && stakeDetails.stake > 0 ? stakeDetails.stake/1e18 : null
    const maxInput = balance === null ? 0 : balance

    const { KCSP_ADDRESS } = getTokenAddresses(context.chainId)
    const { web3 } = context;

    return (
        <Container pendingTx={isTxMining}>
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
                                {formatNumberToHuman(balance)} 
                                <Ticker
                                    ticker="KNC"
                                />
                                <FullNumber>{balance}</FullNumber>
                            </KncContainer>
                }

                <DelegateContainer>
                {
                    balance > 0 && web3.utils.toChecksumAddress(stakeDetails.representative) !== web3.utils.toChecksumAddress(KCSP_ADDRESS)
                    && <DelegateButton 
                            disabled={isTxMining}
                            onClick={() => DelegateVotingPower()}
                        >
                            <Tooltip text="You have tokens in the KNC staking contract but you need to give KCSP your voting power" />
                            Delegate vote to KCSP
                        </DelegateButton>
                }
                </DelegateContainer>
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
                  disabled={!!withdrawAmount === false || isTxMining ? true : false}
                  onClick={() => WithdrawKncTokensFromStakeContract(withdrawAmount)}
                >
                    {
                        isTxMining ? `Withdrawing` : `Withdraw`
                    }
                </WithdrawButton>
                {
                    isTxMining && <TxPending hash={txHash.toString()} />
                }
            </InputContainer>
        </Container>
    )
}
