import React from "react"
import styled, { keyframes} from "styled-components"
import PropTypes from 'prop-types';

import { KNC_CONTENT } from '../../../config'
import { formatRestApiEndpoint } from "../../../utils/endpoints"

TxPending.propTypes = {
    hash: PropTypes.string.isRequired,
}

const Container = styled.div`
    width: 100%;
    display: inline-block;
    font-size: 10pt;

    > a {
        color: #222;
        text-decoration-line: underline;
        text-decoration-style: dotted;

        &:hover {
            cursor: pointer;
        }
    }
`

const loadkeyframes = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }   
`

const LoadingGraphic = styled.div`
    display: inline-grid;
    width: 15px;
    height: 15px;
    margin: 0 0.5em 0 0;

    &::after {
        content: " ";
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 3px solid #FFD02A;
        border-color: #FFD02A transparent #FFD02A transparent;
        animation: ${loadkeyframes} 1.2s linear infinite;
    }
`

export default function TxPending(props) {
    const { hash } = props

    return(
        <Container>
            <LoadingGraphic />
            <a href={formatRestApiEndpoint(KNC_CONTENT.BLOCK_EXPLORER.replace("{hash}", hash))} target="_blank" rel="noopener noreferrer">
                TX: {hash.substring(0, 6)}...{hash.substring(hash.length - 6)}
            </a>
        </Container>
    )
}