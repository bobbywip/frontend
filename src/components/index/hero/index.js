import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

import { PrimaryButton, SecondaryButton } from "../../common/buttons"

import HeroSvg from "../../../static/hero.svg"

const Container = styled.div`
    margin: 0 auto;
    width: 100%;
    background: url(${HeroSvg}) no-repeat center center;
    background-size: cover;

    @media (max-width: 768px) {
        background: url(${HeroSvg}) no-repeat center center;
    }
`
const TaglineContainer = styled.div`
    padding: 5em 3em;
    width: 545px;

    @media (max-width: 768px) {
        padding: 3em;
    }
`
const Tagline = styled.h2`
    width: 445px;
    height: 230px;
    left: 165px;
    right: 830px;
    top: 213px;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: bold;
    font-size: 48px;
    line-height: 56px;
    letter-spacing: -1px;
    color: #212121;

    @media (max-width: 768px) {
        font-size: 24pt;
        width: 50%;
        height: auto;
    }
`
const Buttons = styled.div`
    display: flex;
    
    @media (max-width: 768px) {
        display: block;
    }
`
const ButtonDelegate = styled(PrimaryButton)`
    flex-grow: 0;
    margin: 0 1em 0 0;
    font-size: 16pt;
    width: 219px;
    height: 40px;
    line-height: 10px;

    @media (max-width: 768px) {
        width: 250px;
        display: block;
        margin: 0.5em;
    }

    a {
        color: #222;
        text-decoration: none;

        &:hover {
            cursor: pointer;
        }
    }
`
const ButtonReadMore = styled(SecondaryButton)`
    flex-grow: 0;
    font-size: 16pt;
    margin: 0 1em 0 0;
    height: 40px;
    width: 150px;
    line-height: 10px;

    @media (max-width: 768px) {
        width: 250px;
        display: block;
        margin: 0.5em;
    }

    a {
        color: #222;
        text-decoration: none;

        &:hover {
            cursor: pointer;
        }
    }
`

export default function Hero() {
    return (
        <Container>
            <TaglineContainer>
                <Tagline>
                    Don't let your KNC sit idle, put it to work and get rewarded!
                </Tagline>
                <Buttons>
                    <ButtonDelegate>
                        <Link to="/dashboard">Delegate my vote</Link>
                    </ButtonDelegate>
                    <ButtonReadMore>
                        <a href="https://medium.com/@defidude/kyber-community-pool-now-live-2226bf526081" target="_blank" rel="nofollow noopener">Read More</a>
                    </ButtonReadMore>
                </Buttons>
            </TaglineContainer>
        </Container>
    )
  }
