import React from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

import PreviewSvg from "../../../static/preview.svg"

Preview.propTypes = {
    id: PropTypes.string.isRequired
}
  
Preview.defaultProps = {
    id: "about"
}

const Container = styled.div`
    width: 730px;
    margin: 1em auto;
    padding: 83px 0;

    @media (max-width: 900px) {
        width: 100%;
        margin: auto auto;
    }
`
const Headline = styled.h2`
    height: 180px;
    font-weight: 700;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: bold;
    font-size: 56px;
    line-height: 60px;
    text-align: center;
    letter-spacing: -1px;
    color: #212121;
    display: block;
`
const PreviewImage = styled.img`
    margin: 1em 0;
    width: 1229px;
    margin-left: -35%;

    @media (max-width: 900px) {
        margin: 0;
        width: 100%;
    }
`

export default function Preview(props) {
    const { id } = props

    return (
        <Container id={id}>
            <Headline>
                Earn ETH passively - <br />no strings attached.
            </Headline>
            <PreviewImage src={PreviewSvg} />
        </Container>
    )
}