import React, { useEffect, useContext, useState } from "react"
import styled from "styled-components"

import { AppStateContext } from '../../layout'

import { KNC_CONTENT } from '../../../config'
import Timeline from './timeline'

const Container = styled.div`
    background: #FFF;
    border-radius: 16px;
    color: #000;
    padding: 2em;
    margin: 1em 1em 1em 0;
    flex: 1 1 500px;

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
    margin: 0 0 3.5rem 0;
`

const useGetUserDaoActivityData = address => {
    const [state, setState] = useState({records: null, loading: true}) 

    useEffect(() => {

        if(address === "")
            return

        fetch(KNC_CONTENT.DAO_API_USER_ACTIVITY_URL.replace("{address}", address))
            .then(res => res.json())
            .then(res => {
                setState({records: res, loading: false})
            })
    }, [address])

    return state
}

export default function Activity() {
    const context = useContext(AppStateContext);
    const { records, loading } = useGetUserDaoActivityData(context.address)

    return (
        <Container>
            <Title>Activity Timeline</Title>
            {
                loading || records === null
                    ?
                        `There is no activity to show yet.`
                    :
                        <Timeline
                            data={records.data}
                        />
            }
        </Container>
    )
}
