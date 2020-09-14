import React from "react";
import styled from "styled-components";

import Navigation from "./navigation"

const Container = styled.div`
    padding: 1em 2em;
    width: 100%;
    height: 60px;
`

export default function Header(props) {
  const { connectToWeb3, disconnectWeb3 } = props

  return (
    <Container>
        <Navigation 
          connectToWeb3={connectToWeb3}
          disconnectWeb3={disconnectWeb3}
        />
    </Container>
  )
}