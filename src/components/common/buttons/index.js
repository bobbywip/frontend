import React from "react"
import styled from "styled-components"

const Button = styled.button`
    border: 0;
    border-radius: 5px;
    padding: 0.5em 1em;
    font-size: 12pt;
    display: inline-block;
    width: 100%;
    text-align: center;

    &:hover {
        cursor: pointer;
    }
`

export const PrimaryButton = styled(Button)`
    background: #FFD02A;
    border: 1px solid #FFD02A;
    color: #222;
`
export const SecondaryButton = styled(Button)`
    background: transparent;
    border: 1px solid #212121;
`
const ActionButtonContainer = styled(Button)`
    background: #212121;
    color: #FFD02A;
`
const OnChainButtonContainer = styled(Button)`
    background: #6229FF;
    color: #FFF;   
`

export function ActionButton(props) {
    const { className, text, onClick } = props;

    return (
        <ActionButtonContainer className={className} onClick={() => onClick()}>
            {text}
        </ActionButtonContainer>
    )
}

export function OnChainButton(props) {
    const { className, text } = props;

    return (
        <OnChainButtonContainer className={className}>
            {text}
        </OnChainButtonContainer>
    )
}