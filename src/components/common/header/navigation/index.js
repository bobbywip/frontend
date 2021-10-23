import React from "react"
import { Link, useLocation } from "react-router-dom"
import AnchorLink from 'react-anchor-link-smooth-scroll'
import styled from "styled-components"
import { AppStateContext } from "../../../layout"

// import { PrimaryButton, ActionButton } from "../../buttons"
import { ActionButton } from "../../buttons"
import MyAddress from "./address"

const List = styled.ul`
  list-style-type: none;
  display: inline-block;
`
const Item = styled.li`
  display: inline-block;
  padding: 0 0.5em;
  font-weight: 800;

  // &:last-child {
  //     position: absolute;
  //     right: 2em;
  // }
`
const Title = styled(Link)`
  color: #0065F2;
  display: inline-block;
  line-height: 0;
  font-size: 15pt;
  font-weight: 800;
  text-decoration: none;
`
const NavLink = styled(AnchorLink)`
  color: #212121;
  text-decoration: none;
`
const ExternalLink = styled.a`
  color: #212121;
  text-decoration: none;
`
// const PageLink = styled(Link)`
//   color: #212121;
//   text-decoration: none;
// `

export default function Navigation(props) {
    const location = useLocation();
    const { connectToWeb3, disconnectWeb3 } = props

    const isHomepage = location.pathname === "/"

    return (
      <>
          <Title to="/">KCP</Title>
          <List>
            {
              isHomepage
                &&
                  <>
                    {/* <Item>
                      <NavLink href="#about">About</NavLink>
                    </Item>
                    <Item>
                      <NavLink href="#how-it-works">How it works</NavLink>
                    </Item>
                    <Item>
                      <NavLink href="#team">Team</NavLink>
                    </Item> */}
                    <Item>
                      <NavLink href="#faq">FAQ</NavLink>
                    </Item>
                    <Item>
                      <ExternalLink href="https://discord.com/invite/D3d8B7JvdQ" rel="noopener noreferrer" target="_blank">Support</ExternalLink>
                    </Item>
                    {/* <Item>
                      <PageLink to="/dashboard">
                        <PrimaryButton style={{width: '106px'}}>Deposit</PrimaryButton>
                      </PageLink>
                    </Item> */}
                  </>
              }

            {
              !isHomepage 
                &&
                  <Item>
                    <AppStateContext.Consumer>
                      {context => {
                        return context.connected
                          ?
                            <MyAddress
                              address={context.address}
                              handleOnClick={() => disconnectWeb3()}
                            />
                          :
                            <ActionButton 
                              text="Connect a wallet" 
                              onClick={() => connectToWeb3()} 
                            />
                        }
                      }
                    </AppStateContext.Consumer>
                  </Item>
            }
          </List>
      </>
    )
  }