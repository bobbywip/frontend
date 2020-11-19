import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"

import { OnChainButton } from "../../common/buttons"
import Tooltip from "../../common/tooltip"

import { AppStateContext } from "../../layout"
import { toFixedDecimals } from "../../../utils/numbers"
import { getTokenAddresses } from "../../../utils/web3"
import { KCSP_CONTRACT_ABI, KNC_STAKING_ABI } from "../../../config"

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
const ClaimTitle = styled.h4`
    font-size: 14px;
    font-weight: 300;
    display: block;
    margin: 0;
`
const Input = styled.input`
    display: inline-block;
    margin-top: 1rem;
    border: 1px solid #212121;
    border-radius: 5px;
    background: transparent;
    padding: 0.5em;
    margin: 0.5em 1em 0 0;
    width: auto;
`
const RedeemButton = styled(OnChainButton)`
    width: auto;
    display: inline-block;
`

const useGetRewardsForMember = (address, chainId, networkId, web3) => {
    const [state, setState] = useState({records: null, loading: true}) 

    useEffect(() => {
        if(address === "")
            return

        async function fetchData() {
            const { KCSP_ADDRESS, KNC_STAKING_ADDRESS } = getTokenAddresses(chainId)

            const stakeContract = await new web3.eth.Contract(KNC_STAKING_ABI, KNC_STAKING_ADDRESS)
            const nowTimestamp = Math.ceil(new Date().getTime() / 1000)
            // Now get the current epoch
            const epoch = await stakeContract.methods.getEpochNumber(nowTimestamp).call();
        
            const contract = await new web3.eth.Contract(KCSP_CONTRACT_ABI, KCSP_ADDRESS)
            await contract.methods.getAllUnclaimedRewardsDataMember(address, 0, epoch).call((error, res) => {
                setState({data: res[0], loading: false})
            })
        }

        fetchData()

    }, [address, chainId, networkId, web3])

    return state
}

function renderRewardAmount(data, loading)
{
    if(loading || !data) {
        return '...'
    }

    if(data.length === 0) {
        return 0
    }

    if(data.rewards <= 0) {
        return 0
    }

    const rewardToFixed = toFixedDecimals(data.rewards / 1e18, 2)
    return rewardToFixed
}

export default function Claim() {
    const { address, chainId, networkId, web3 } = useContext(AppStateContext);
    const { data, loading } = useGetRewardsForMember(address, chainId, networkId, web3)

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
                        <Tooltip text={data && [toFixedDecimals(data.rewards/1e18, 6),"ETH"].join("")} />
                    </RewardCurrency>
                </SegmentContainer>
                <SegmentContainer>
                    <ClaimContainer>
                        <ClaimTitle>
                            Redeem
                        </ClaimTitle>
                        <Input 
                            placeholder="ETH amount"
                            type="number"
                            name="amount"
                            autocomplete="off"
                        />
                        <RedeemButton 
                            text="Redeem"
                        />
                    </ClaimContainer>
                </SegmentContainer>
            </BodyContainer>
        </Container>
    )
}
