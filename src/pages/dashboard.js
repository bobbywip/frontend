import React, { useContext } from "react"
import styled from "styled-components"

import Layout from "../components/layout"
import { AppStateContext } from "../components/layout"

import Header from "../components/dashboard/header"
import Announcement from "../components/dashboard/announcement"
import KNCAction from "../components/dashboard/kncactions"
import { PrimaryButton, ActionButton } from "../components/common/buttons"
import NetworkGraph from "../components/dashboard/networkfeegraph"
import KNCBalance from "../components/dashboard/kncbalance"
import KNCClaim from "../components/dashboard/kncclaim"
import Portfolio from "../components/dashboard/portfolio"
import Activity from "../components/dashboard/activity"

const MainContainer = styled.div`
  width: 80%;
  margin: auto auto;
`
const PillContainer = styled.div`
  background: #F8F8F8;
  border-radius: 16px;
  padding: 1em;
`
const ActionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Template = props => {
  return(
    <Layout>
      {props.children}
    </Layout>
  )
}

const DashboardContents = () => {
  const context = useContext(AppStateContext);

  const userKncBalance = context && context.assets[0] && context.assets[0].knc > 0 ? context.assets[0].knc : null
  const userKncStaked = context && context.stake && context.stake.stake > 0 ? context.stake.stake : null

  return(
      <MainContainer>
        <Header />
        <PillContainer>
          <Announcement />
          <ActionContainer>
            <KNCAction
              title="Total KNC Balance"
              balance={userKncBalance}
              defaultDescription={`You have no KNC tokens yet.`}
              actionName="Deposit"
              actionButton={
                <PrimaryButton 
                  text="Deposit" 
                />
              }
            />
            <KNCAction
              title="KNC in Pool"
              balance={userKncStaked}
              defaultDescription={`You have no tokens in the pool yet. First you have to deposit KNC tokens.`}
              actionName="Withdraw"
              actionButton={
                <ActionButton 
                  text="Withdraw"
                />
              }
            />
            <NetworkGraph />
          </ActionContainer>
          <ActionContainer>
            <KNCBalance />
            <KNCClaim />
          </ActionContainer>
          <ActionContainer>
            <Portfolio />
            <Activity />
          </ActionContainer>
        </PillContainer>
      </MainContainer>
  )
}

export default function Dashboard() {
  return (
    <Template>
      <DashboardContents />
    </Template>
  )
}
