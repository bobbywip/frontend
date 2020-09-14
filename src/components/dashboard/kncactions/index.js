import React from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

import Ticker from '../../common/ticker'

KNCActions.propTypes = {
    title: PropTypes.string.isRequired,
    balance: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.instanceOf(null)
    ]),
    defaultDescription: PropTypes.string.isRequired,
    actionName: PropTypes.string.isRequired,
    actionButton: PropTypes.element.isRequired,
}

const Container = styled.div`
    background: #FFF;
    border-radius: 16px;
    color: #000;
    padding: 2em;
    margin: 1em 1em 1em 0;
    flex: 0 1 200px;

    @media (max-width: 650px) {
        flex: 1 1 100%;
    }
`
const Title = styled.div`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.1px;
    color: #000000;
`
const Description = styled.div`
    text-align: center;
    height: 150px;
    margin: 2em 0.5em 0;
`
const DefaultDescription = styled.div`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.1px;
    color: #BDBDBD;
`
const Separator = styled.hr`
    width: 100%;
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #E5E5E5, #E9E9E9, #E5E5E5);
    margin: 0 0 2em 0;
`
const InputContainer = styled.div`
    display: grid;
    place-items: center;
`
const Input = styled.input`
    padding: 1em;
    margin: 0.5em 0;
    border: 1px solid #BDBDBD;
    border-radius: 5px;
    display: block;
    width: 100%;
`
const KncContainer = styled.div`
    display: inline-block;
    font-size: 72px;
    text-align: center;
`

export default function KNCActions(props) {
    const { title, balance, defaultDescription, actionName, actionButton } = props

    const maxInput = balance === null ? 0 : balance

    return (
        <Container>
            <Title>{title}</Title>
            <Description>
                {
                    balance === null 
                        ?
                            <DefaultDescription>
                                {defaultDescription}
                            </DefaultDescription>
                        :
                            <KncContainer>
                                {
                                    balance > 999 
                                    ? 
                                        Math.sign(balance) * ((Math.abs(balance)/1000).toFixed(1)) + `k`
                                    :
                                        Math.sign(balance) * Math.abs(balance)
                                } 
                                <Ticker
                                    ticker="KNC"
                                />
                            </KncContainer>
                }
            </Description>
            <Separator />
            <Title>{actionName}</Title>
            <InputContainer>
                <Input 
                    type="number"
                    placeholder="KNC amount"
                    name="input"
                    max={maxInput}
                    min={0}
                />
                {actionButton}
            </InputContainer>
        </Container>
    )
}
