import React from "react"
import styled from "styled-components"

import { TEAM_CONTENT } from "../../../config"
  
BuiltBy.defaultProps = {
    id: "team"
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
const ItemContainer = styled.div`
    display: inline-block;
`
const Item = styled.div`

    &:first-child {
        display: block;
        text-align: center;
        margin: 1rem 0;
    }

    &:not(first-child) {
        display: inline-block;
        margin: 1rem 1rem;
    }

    padding: 0 1em;
    font-weight: 800;

    @media (max-width: 900px) {
        display: inline-block;
        flex: 0 1 100px;
        margin: 5px;
    }
`
const Image = styled.img`
    width: 145px;
    height: 145px;
    border-radius: 50%;
`
const Caption = styled.div`
    font-size: 0.8rem;
    display: block;
    font-weight: normal;
    color: #000;
    text-decoration: none;

    @media (max-width: 900px) {
        display: none;
    }
`

export default function BuiltBy(props) {
    const { id } = props

    return (
        <Container id={id}>
            <Title>Built By</Title>
            <ItemContainer>
            {
                TEAM_CONTENT.map(team => {
                    return(
                        <Item key={team.id}>
                            <a href={team.link} rel="noopener noreferrer" target="_blank">
                                <Image src={team.image} title={team.name} alt={team.name} />
                                <Caption>
                                    {team.name} &mdash; {team.role}
                                </Caption>
                            </a>
                        </Item>
                    )
                })
            }
            </ItemContainer>
        </Container>
    )
  }