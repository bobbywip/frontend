import React from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

Ticker.propTypes = {
    ticker: PropTypes.string.isRequired,
}

const Container = styled.span`
    font-size: 14px;
`

export default function Ticker(props) {
    const { ticker } = props

    return(
        <Container>
            {ticker.toUpperCase()}
        </Container>
    )
}