import React from "react"
import styled from "styled-components"

import Banner from "../../../static/banners/community.svg"

const Container = styled.div`
    margin: 0 0 1em 0;
    background: #FFF;
    padding: 2em;
    border-radius: 16px;
    color: #000;

    @media (min-width: 650px) {
        background-image: url(${Banner});
        background-position: 100% 0px, right 3em bottom 2em;
        background-repeat: no-repeat;
    }
`
const Date = styled.div`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.1px;
`
const Title = styled.div`
    margin: 0.5em 0;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: 0.1px;
    width: 55%;
`
const ReadMore = styled.span`
    margin: 0.5em 0;
    text-decoration: underline;
    font-size: 14px;
    font-family: Helvetica Neue;
    color: #000;

    a {
        color: #000;
        text-decoration: none;

        &:hover {
            cursor: pointer;
        }
    }
`

export default function Announcement() {
  return (
    <Container>
        <Date>10/20/2020</Date>
        <Title>Kyber Community Pool is now live!</Title>
        <ReadMore>
            <a href="https://medium.com/@defidude/kyber-community-pool-now-live-2226bf526081" target="_blank" rel="noopener noreferrer">Read More</a>
        </ReadMore>
    </Container>
  )
}
