import React from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

MyAddress.propTypes = {
    address: PropTypes.string.isRequired
}

const Container = styled.div`
    display: flex;
    margin: 0;
`
const Ellipse = styled.div`
    background: #FFC107;
    border: 1px solid #FFC107;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: inline-block;
    margin: 5px 0.5em 0 0;
`
const AddressContainer = styled.div`
    background: #FFECB3;
    border-radius: 16px;
    padding: 10px 15px;
    display: flex;
    flex-direction: row;
    font-size: 12pt;
    display: inline-block;
    color: #00132F;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    margin: 0;
`
const Disconnect = styled.div`
    display: block;
    font-size: 10pt;
    text-align: right;
    font-weight: 250;

    &:hover {
        cursor: pointer;
        opacity: 0.7;
    }
`

export default function MyAddress(props) {
    const { address, handleOnClick } = props

    return (
        <>
            <Container>
                <Ellipse />
                <AddressContainer>
                {
                    [address.substr(0, 6), address.substr(-6)].join('....')
                }
                </AddressContainer>
            </Container>
            <Disconnect onClick={() => handleOnClick()}>
                Disconnect
            </Disconnect>
        </>
    )
}