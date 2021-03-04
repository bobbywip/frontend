import React from "react"
import styled from "styled-components"

import DelegatedAmount from '../delegatedamount'

const Container = styled.div`
    width: 100%;
    display: block;
    margin: auto auto;
    max-width: 1238px;
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
const InfoBar = styled.div`
    width: 100%;
    display: block;
    background: #ffedaa;
    border: 2px solid #dbcc93;
    padding: 0.5em;
    border-radius: 0.5em;
`

export default function Header() {
  return (
    <Container>
        <InfoBar>
          ⚠️ We are currently facing node issues meaning some values will not be reflected correctly on this UI.{' '}
          Please see the "Troubleshooting" section in <a href="https://mandelliant.medium.com/how-to-stake-knc-and-earn-rewards-with-the-kyber-community-pool-fa9142f2ca8a" target="_blank" rel="noreferrer noopener">this guide</a>.
        </InfoBar>
        <Title>Kyber Community Staking Dashboard</Title>
        <DelegatedAmount />
    </Container>
  )
}
