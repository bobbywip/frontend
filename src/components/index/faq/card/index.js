import React from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

Card.propTypes = {
    id: PropTypes.number.isRequired,
    question: PropTypes.string,
    answer: PropTypes.string
}
  
Card.defaultProps = {
    id: "",
    question: "",
    answer: ""
}

const Container = styled.div`
    flex: 1 1 325px;
    margin: 29px 59px;
    background: ${props => props.id === 1 ? "#FFD02A" : "#F8F8F8"};
`
const Question = styled.h3`
    padding: 0 32px;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    color: #212121;
`
const Answer = styled.p`
    padding: 0 32px;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.1px;
    color: #212121;
`

export default function Card(props) {
    const { id, question, answer } = props

    return (
        <Container key={id} id={id}>
            <Question>Question {id} &mdash; {question}</Question>
            <Answer>{answer}</Answer>
        </Container>
    )
  }