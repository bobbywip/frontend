import React, { useContext } from "react"
import styled from "styled-components"

import Layout from "../components/layout"
import { AppStateContext } from "../components/layout"

import Header from "../components/dashboard/header"
import Announcement from "../components/dashboard/announcement"
import Deposit from "../components/dashboard/deposit"
import Withdraw from "../components/dashboard/withdraw"
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
  return(
      <MainContainer>
        <Header />
        <PillContainer>
          <Announcement />
          <ActionContainer>
            <Deposit />
            <Withdraw />
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
