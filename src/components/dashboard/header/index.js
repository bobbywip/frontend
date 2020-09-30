import React from "react"
import styled from "styled-components"

import { PrimaryButton } from "../../common/buttons"

const Container = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: minmax(150px, 90%) 1fr;
    margin: 0;
    padding: 0;
`
const Title = styled.h2`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    letter-spacing: 0.1px;
    color: #6229FF;
`
const Trade = styled.div`
    place-items: center;
    text-align: right;
    margin: auto 0;
    width: 100px;
    right: 0;
    color: #212121;
`

export default function Header() {
  return (
    <Container>
        <Title>Kyber Community Staking Dashboard</Title>
        <Trade>
            <a href="https://www.coingecko.com/en/coins/kyber-network#markets" target="_blank" rel="noreferrer noopener">
                <PrimaryButton>Trade</PrimaryButton>
            </a>
        </Trade>
    </Container>
  )
}
