import React from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

Supporters.propTypes = {
    id: PropTypes.string.isRequired,
    supporters: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
        })
    )
}
  
Supporters.defaultProps = {
    id: "supporters"
}

const Container = styled.div`
    margin: 5rem auto;
    width: 100%;
    display: grid;
    place-items: center;

    @media (max-width: 900px) {
        margin: 1em;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
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
const List = styled.ul`
    margin: auto auto;
    list-style-type: none;
    display: inline-block;
`
const Item = styled.li`
    display: inline-block;
    padding: 0 1em;
    font-weight: 800;

    @media (max-width: 900px) {
        flex: 0 1 100px;
        margin: 5px;
    }
`

export default function Supporters(props) {
    const { id, supporters } = props

    return (
        <Container id={id}>
            <Title>Supporters</Title>
            <List>
                {
                    supporters.map(supporter => {
                        return(
                            <Item key={supporter.id}>
                                <img src={supporter.image} title={supporter.text} alt={supporter.text} />
                            </Item>
                        )
                    })
                }
            </List>
        </Container>
    )
  }