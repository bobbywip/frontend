import React, { useState } from "react"
import styled from "styled-components"

const Container = styled.div`
    background: transparent;
    color: #212121;
    display: inline-block;
`

const List = styled.div`
    margin: 0;
    padding: 0;
`
const Item = styled.div`
    display: inline-block;
    font-size: 16px;
    padding: 0 1em;
    margin: 0;

    box-sizing: border-box;
    border-color: #212121;
    border-style: solid;

    &:first-child {
        border-width: 2px 0 2px 2px;
        border-radius: 50px 0 0 50px;
    }

    &:not(:first-child):not(:last-child) {
        border-width: 2px 0 2px 0;
    }

    &:last-child {
        border-width: 2px 2px 2px 0;
        border-radius: 0 50px 50px 0;
    }

    &:hover {
        cursor: pointer;
    }

    ${props => props.isActive 
        &&
        `
            background: #212121;
            color: #FFF;
        `
    }
`

const Pills = () => {
    const [ selectedOption, setSelectedOption ] = useState(0)

    const handleClick = (activeInt) => {
        setSelectedOption(activeInt)
    }
    
    return (
        <Container>
            <List>
                <Item onClick={() => handleClick(0)} isActive={selectedOption === 0}>Weekly</Item>
                <Item onClick={() => handleClick(1)} isActive={selectedOption === 1}>Monthly</Item>
                <Item onClick={() => handleClick(2)} isActive={selectedOption === 2}>Yearly</Item>
            </List>
        </Container>
    )
}

export default Pills
