import React from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

Cards.propTypes = {
    id: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            header: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired
        })
    )
}
  
Cards.defaultProps = {
    id: "how-it-works"
}

const Container = styled.div`
    margin: auto 0;
    width: auto;
    background: #F8F8F8;
    display: grid;
    place-items: center;
`
const Card = styled.div`
    display: inline-block;
    vertical-align: top;
    margin: 2em 0;
    width: 700px;

    @media (max-width: 768px) {
        width: 100%;
        padding: 0 2rem;
    }
`
const Image = styled.img`
    height: 211px;
    width: 211px;
    float: ${props => props.id % 2 ? 'left' : 'right'};
    padding: 0.5em;

    @media (max-width: 768px) {
        clear: both;
        float: none;
        margin: auto;
        display: block;
    }
`
const Heading = styled.div`
    color: #6229FF;
    text-align: ${props => props.id % 2 ? 'left' : 'right'};
    font-size: 24pt;
    font-weight: 800;

    @media (max-width: 768px) {
        text-align: left;
        margin-top: 1em;
        clear: both;
        float: none;
    }
`
const Body = styled.div`
    color: #212121;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    letter-spacing: 0.1px;
    font-size: 12pt;
    line-height: normal;
    text-align: ${props => props.id % 2 ? 'left' : 'right'};
    width: 80%;

    @media (max-width: 768px) {
        text-align: left;
        width: 100%;
    }
`

export default function Cards(props) {
    const { id, cards } = props

    cards.sort((a, b) => (a.id > b.id) ? -1 : 1);

    return (
        <Container id={id}>
            {
                cards.map(card => {
                    return(
                        <Card key={card.key}>
                            <Image id={card.key} src={card.image} />
                            <Heading id={card.key}>{card.header}</Heading>
                            <Body id={card.key}>{card.body}</Body>
                        </Card>
                    )
                })
            }
        </Container>
    )
}