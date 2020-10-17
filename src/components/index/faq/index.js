import React from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

import Card from "./card"

Faq.propTypes = {
  id: PropTypes.string,
  faqs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        question: PropTypes.string,
        answer: PropTypes.string,
    })
  )
}

Faq.defaultProps = {
  id: "faq"
}

const Container = styled.div`
    margin: 59px auto 68px auto;
    width: 100%;
    display: grid;
    place-items: center;
`
const Title = styled.h3`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
    text-align: center;
    letter-spacing: 0.1px;
    color: #212121;
`
const Faqs = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 168px;

    @media (max-width: 768px) {
        margin: 1em;
    }
`

export default function Faq(props) {
    const { id, faqs } = props

    return (
        <Container id={id}>
            <Title>Frequently Asked Questions</Title>
            <Faqs>
              {
                  faqs.map(faq => {
                      return(
                          <Card
                            key={faq.id}
                            id={faq.id}
                            question={faq.question}
                            answer={faq.answer}
                          />
                      )
                  })
              }
            </Faqs>
        </Container>
    )
  }