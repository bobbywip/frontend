import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"

import { OnChainButton } from "../../common/buttons"
import Tooltip from "../../common/tooltip"

import { AppStateContext } from "../../layout"
import { toFixedDecimals } from "../../../utils/numbers"
import { getTokenAddresses, getTransactionReceiptMined } from "../../../utils/web3"
import TxPending from '../../common/txpending'
import { KCSP_CONTRACT_ABI, KNC_STAKING_ABI, WEB3SETTINGS } from "../../../config"

const Container = styled.div`
    height: 110px;
    background: #FFD02A;
    border-radius: 16px;
    color: #000;
    padding: 2em;
    margin: 0.5em 1em 0.5em 0;
    flex: 1 1 500px;

    @media (max-width: 650px) {
        flex: 1 1 100%;
    }
`
const HeaderContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
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
    margin: 0 1em;
    display: grid;
    grid-template-columns: minmax(150px, 25%) 1fr;
    height: 90px;
`
const SegmentContainer = styled.div`
    flex: 0 1 auto;
`
const RewardAmount = styled.div`
    display: inline-block;
    margin-top: -1.25rem;
    margin-bottom: 0;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 500;
    font-size: 72px;
    line-height: 88px;
    text-align: right;
    letter-spacing: 0.1px;
    color: #212121;
`
const RewardCurrency = styled.div`
    display: inline-block;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.1px;
    color: #212121;
    align-self: flex-end;
    margin: 0 2em 0 0;
`
const ClaimContainer = styled.div`
    display: inline-block;
    border-left: 1px solid #212121;
    width: 100%;
    padding: 0 0 0 5em;
`
const RedeemButton = styled(OnChainButton)`
    width: auto;
    display: inline-block;

    ${props => props.disabled &&
        `
            opacity: 0.5;
            &:hover {
                cursor: not-allowed;
            }
        `
    }
`

const useGetRewardsForMember = (address, chainId, networkId, web3) => {
    const [state, setState] = useState({records: null, epoch: null, loading: true}) 

    useEffect(() => {
        if(address === "")
            return

        async function fetchData() {
            const { KCSP_ADDRESS, KNC_STAKING_ADDRESS } = getTokenAddresses(chainId)

            const stakeContract = await new web3.eth.Contract(KNC_STAKING_ABI, KNC_STAKING_ADDRESS)
            const nowTimestamp = Math.ceil(new Date().getTime() / 1000)
            // Now get the current epoch
            const epoch = await stakeContract.methods.getEpochNumber(nowTimestamp).call();
            console.log(`useGetRewardsForMember - current epoch: ${epoch}`)
        
            const contract = await new web3.eth.Contract(KCSP_CONTRACT_ABI, KCSP_ADDRESS)
            await contract.methods.getAllUnclaimedRewardsDataMember(address, 0, epoch).call((error, res) => {
                console.log(`useGetRewardsForMember - all unclaimed`, res)

                // Get the data we need
                // Rewards are always in 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE (ETH)
                const rewards = {"eth": [], "epochs": []}
                if(res.length) {
                    res.forEach((data) => {
                        rewards.epochs.push(data.epoch)
                        rewards.eth.push(data.rewards)
                    })
                }

                setState({data: rewards, epoch: epoch, loading: false})
            })
        }

        fetchData()

    }, [address, chainId, networkId, web3])

    return state
}

function renderRewardAmount(data, loading)
{
    if(loading || !data) {
        return 0
    }

    if(data.length === 0) {
        return 0
    }

    if(data.eth.length <= 0) {
        return 0
    }

    const rewardToFixed = toFixedDecimals(data.eth.reduce((a, b) => parseInt(a) + parseInt(b)) / 1e18, 2)
    return rewardToFixed
}

export default function Claim() {
    const { address, chainId, networkId, web3 } = useContext(AppStateContext);
    const [isTxMining, setIsTxMining] = useState(false)
    const [txHash, setTxHash] = useState(0)
    const { data, loading } = useGetRewardsForMember(address, chainId, networkId, web3)

    async function redeemRewards() {
        if(isTxMining || data === undefined || data.epoch === null) {
            return
        }

        const { epoch } = data

        if(epoch === null) {
            console.log(`Epoch data not fetched yet`)
            return
        }

        const { KCSP_ADDRESS } = getTokenAddresses(chainId)
        const kcspContract = await new web3.eth.Contract(KCSP_CONTRACT_ABI, KCSP_ADDRESS)

        // Now send the claimRewardsMembers to claim everything
        const epochsToClaim =  Array.from({length: epoch - WEB3SETTINGS.KCP.DEPLOYED_EPOCH+1},(v,k)=>k+WEB3SETTINGS.KCP.DEPLOYED_EPOCH)
        console.log(`Calling claimRewardsMember with params`, address, epochsToClaim)
        await kcspContract.methods.claimRewardsMember(address, epochsToClaim).send({from: address}, async function(err, txHash) {
            console.log(err)

            if(!err) {
                console.log(`TxHash: ${txHash}`)
                setIsTxMining(true)
                setTxHash(txHash)
                const receipt = await getTransactionReceiptMined(txHash, web3)
                console.log(receipt)

                setIsTxMining(false)
                setTxHash(false)
            }
        })
    }

    return (
        <Container>
            <HeaderContainer>
                <Title>
                    <Tooltip text="This panel details the amount of rewards you have from the pool and allows you to claim them" />
                    Your Fees Earned
                </Title>
            </HeaderContainer>
            <BodyContainer>
                <SegmentContainer>
                    <RewardAmount>
                        {
                            !web3 ? '...' : renderRewardAmount(data, loading)
                        }
                    </RewardAmount>
                    <RewardCurrency>
                        ETH
                        {data && data.eth.length > 0 && <Tooltip text={["Unclaimed:", (data.eth.reduce((a, b) => parseInt(a) + parseInt(b), 0)/1e18).toString().substring(0, 10), "ETH"].join(" ")} />}
                    </RewardCurrency>
                </SegmentContainer>
                <SegmentContainer>
                    <ClaimContainer>
                        <RedeemButton 
                            text="Redeem all unclaimed"
                            onClick={() => redeemRewards()}
                            disabled={!(data && data.eth.length > 0) || isTxMining ? true : false}
                        />
                    {
                        isTxMining && <TxPending hash={txHash.toString()} />
                    }
                    </ClaimContainer>
                </SegmentContainer>
            </BodyContainer>
        </Container>
    )
}
