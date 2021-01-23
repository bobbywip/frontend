import React from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

Tooltip.propTypes = {
    text: PropTypes.string.isRequired,
}

const Container = styled.div`
    --scale: 0;
    --arrow-size: 10px;

    font-size: 10pt;
    border-radius: 50%;
    border: 1px solid ${props => props.styling && props.styling.bg ? props.styling.bg : `#222`};
    background: ${props => props.styling && props.styling.bg ? props.styling.bg : `#222`};
    opacity: ${props => props.styling && props.styling.opacity ? props.styling.opacity : 1};
    height: 15px;
    width: 15px;
    display: inline-block;
    color: #FFF;
    text-align: center;
    margin: 0 0.5em;
    position: relative;

    &::after, &::before {
        position: absolute;
        top: -.25rem;
        left: 50%;
        content: '';
        transform: translateX(-50%) translateY(var(--translate-y, 0)) scale(var(--scale));
        transisiton: 150ms transform;
        transform-origin: bottom center;
    }

    &::before {
        --translate-y: calc(-100% - var(--arrow-size));

        padding: 0.5rem;
        background: #222;
        font-size: 8pt;
        max-width: 550%;
        border-radius: .3rem;
        width: max-content;
        content: attr(data-tooltip);
        color: #FFF;
        text-align: center;
    }

    &::after {
        --translate-y: calc(-1 * var(--arrow-size));

        content: '';
        border: var(--arrow-size) solid transparent;
        border-top-color: #222;
        transform-origin: top center;
    }

    &:hover {
        cursor: pointer;

        &::before, &::after {
            --scale: 1;
        }

        &::before {
            content: attr(data-tooltip);
        }
    }
`

export default function Tooltip(props) {
    const { text, icon, options } = props

    return(
        <Container styling={options} data-tooltip={text}>
            {
                !icon 
                    ? `?` 
                    : icon
            }
        </Container>
    )
}