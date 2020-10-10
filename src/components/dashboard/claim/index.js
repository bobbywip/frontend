import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"

import { OnChainButton } from "../../common/buttons"
import Tooltip from "../../common/tooltip"

import { AppStateContext } from "../../layout"
import { WEB3SETTINGS } from "../../../config"
const KCSP_CONTRACT_ABI = require("../../../config/web3/contracts/abis/kscp_abi.json")

const Container = styled.div`
    height: 110px;
    border: 1px solid #c5c5c5;
    background: #FFD02A;
    border-radius: 16px;
    color: #000;
    padding: 2em;
    margin: 1em 1em 1em 0;
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
    padding: 0 0 0 3em;
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

const useGetRewardsForMember = (address, networkId, web3) => {
    const [state, setState] = useState({records: null, loading: true}) 

    useEffect(() => {
        if(address === "")
            return

        async function fetchData() {
            let KCSP_CONTRACT_ADDRESS;
            switch(networkId) {
                case 1:
                default:
                    KCSP_CONTRACT_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.MAINNET.KCSP_ADDRESS
                break;
                case 3:
                    KCSP_CONTRACT_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.TESTNET.KCSP_ADDRESS
                break;
            }
        
            const contract = await new web3.eth.Contract(KCSP_CONTRACT_ABI, KCSP_CONTRACT_ADDRESS)
            await contract.methods.getAllUnclaimedRewardsDataMember(address).call((error, res) => {
                setState({data: res, loading: false})
            })
        }

        fetchData()

    }, [address, networkId, web3])

    return state
}

function renderRewardAmount(data, loading)
{
    if(loading) {
        return '...'
    }

    if(data.length === 0) {
        return 0
    }

    // @todo - sum the total rewards and return ETH reward amount
    return '?'
}

export default function Claim() {
    const { address, networkId, web3 } = useContext(AppStateContext);
    const { data, loading } = useGetRewardsForMember(address, networkId, web3)

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
                            renderRewardAmount(data, loading)
                        }
                    </RewardAmount>
                    <RewardCurrency>
                        ETH
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
