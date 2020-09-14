import React from "react"
import styled from "styled-components"

import Layout from "../components/layout"
import Hero from "../components/index/hero"
import Preview from "../components/index/preview"
import Cards from "../components/index/cards"
import Supporters from "../components/index/supporters"
import Faq from "../components/index/faq"

import { HOW_IT_WORKS_CONTENT, SUPPORTERS_CONTENT, FAQ_CONTENT } from "../config"

const MainContainer = styled.div`
  width: 100%;
`

export default function Home({ location }) {

  return (
    <Layout 
      location={location}
    >
      <Hero />
      <MainContainer>
        <Preview />
        <Cards 
          cards={HOW_IT_WORKS_CONTENT} />
        <Supporters 
          supporters={SUPPORTERS_CONTENT}
        />
        <Faq 
          faqs={FAQ_CONTENT}
        />
      </MainContainer>
    </Layout>
  )
}
