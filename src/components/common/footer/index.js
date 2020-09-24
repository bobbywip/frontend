import React  from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

Footer.propTypes = {
    id: PropTypes.string.isRequired,
    socials: PropTypes.arrayOf(
        PropTypes.shape({
            image: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired
        })
    )
}
  
Footer.defaultProps = {
    id: "contact"
}

const Container = styled.div`
    margin: 158px 0 0.1em 0;
    width: 100%;
    display: grid;
    place-items: center;
`
const Socials = styled.ul`
    list-style-type: none;
    display: inline-block;
    margin: 188px 0 0 0;
`
const Item = styled.li`
    display: inline-block;
    padding: 0 0.5em;
`
const Image = styled.img`
    min-height: 32px;
    min-width: 32px;
`
const Links = styled.div`
    display: inline-block;
`
const Copyright = styled.div`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: #212121;
    margin: 0.5em 0 2em 0;
`

export default function Footer(props) {
    const { id, socials } = props

    return (
        <Container>
            <Socials id={id}>
                {
                    socials.map((social) => {
                        return(
                            <Item key={social.title}>
                                <a href={social.link} target="_blank" rel="noopener noreferrer">
                                    <Image src={social.image} title={social.title} alt={social.title} />
                                </a>
                            </Item>
                        )
                    })
                }
            </Socials>
            <Links>
                {' '}
            </Links>
            <Copyright>
                &copy; Kyber Community Pool. All rights reserved.
            </Copyright>
        </Container>
    )
  }