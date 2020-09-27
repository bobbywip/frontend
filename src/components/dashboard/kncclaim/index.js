import React from "react"
import styled from "styled-components"

import { OnChainButton } from "../../common/buttons"

const Container = styled.div`
    height: 110px;
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
    margin: 0 2em;
    display: grid;
    grid-template-columns: minmax(150px, 25%) 1fr;
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
    height: 100%;
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

export default function KNCClaim() {
    return (
        <Container>
            <HeaderContainer>
                <Title>Your Fees Earned</Title>
            </HeaderContainer>
            <BodyContainer>
                <SegmentContainer>
                    <RewardAmount>
                        0
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
