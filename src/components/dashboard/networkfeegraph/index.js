import React from "react"
import styled from "styled-components"

import Pills from "../../common/pills"

const Container = styled.div`
    background: #FFF;
    border-radius: 16px;
    color: #000;
    padding: 2em;
    margin: 1em 1em 1em 0;
    flex: 1 1 400px;

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
    display: block;
    width: 100%;
    height: 100%;
`
const NoFeesContainer = styled.div`
    display: grid;
    grid-template-rows: 150px 40px;
    place-items: center;
    overflow: auto;
    width: 100%;
    height: 100%;
    background-image: url(/empty-graph.png);
    background-repeat: no-repeat;
    background-position: left;
`
const TextContainer = styled.div`
    display: block;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.1px;
    color: #BDBDBD;
`

export default function NetworkFeeGraph() {
    return (
        <Container>
            <HeaderContainer>
                <Title>Total Fees Earned</Title>
                <Pills />
            </HeaderContainer>
            <BodyContainer>
                <NoFeesContainer>
                    <TextContainer>
                        You haven't earned any fees yet. First you have to deposit KNC tokens.
                    </TextContainer>
                </NoFeesContainer>
            </BodyContainer>
        </Container>
    )
}
