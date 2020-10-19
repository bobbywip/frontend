import React, { useEffect, useContext, useState } from "react"
import styled from "styled-components"

import { AppStateContext } from '../../layout'
import { formatRestApiEndpoint } from '../../../utils/endpoints'

import Tooltip from '../../common/tooltip'
import { KNC_CONTENT } from '../../../config'
import Timeline from './timeline'

const Container = styled.div`
    background: #FFF;
    border-radius: 16px;
    color: #000;
    padding: 2em;
    margin: 1em 1em 1em 0;
    flex: 1 1 500px;
    height: auto;

    @media (min-width: 1580px) {
        position: absolute;
        right: 0;
        margin-top: -18rem;
        width: 594px;
        height: 437px;
    }

    @media (max-width: 650px) {
        flex: 1 1 100%;
    }
`
const HeaderContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`
const Title = styled.div`
    flex: 0 1 55%;
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.1px;
    color: #000000;
`
const ViewAllContainer = styled.div`
    flex: 0 1 45%;
    text-align: right;
    font-size: 14px;
    text-decoration: underline;

    &:hover {
        cursor: pointer;
    }
`
const NoActivityContainer = styled.div`
    display: grid;
    place-items: center;
    color: #BDBDBD;
    font-size: 14px;
    margin: 2em 0;
    height: 5rem;
    padding-top: 3rem;

    @media (min-width: 1580px) {
        height: 300px;
    }

    background: repeating-linear-gradient(
        white, white 35px,
        #efefef 36px, #efefef 37px
    );
`

const useGetUserDaoActivityData = (address, chainId) => {
    const [state, setState] = useState({records: null, loading: true}) 

    useEffect(() => {

        if(address === "")
            return

        fetch(formatRestApiEndpoint(KNC_CONTENT.DAO_API_USER_ACTIVITY_URL.replace("{address}", address), chainId))
            .then(res => res.json())
            .then(res => {
                setState({records: res, loading: false})
            })
    }, [address, chainId])

    return state
}

export default function Activity() {
    const [showAllActivity, setShowAllActivity] = useState(false)
    const { address, chainId } = useContext(AppStateContext);
    const { records, loading } = useGetUserDaoActivityData(address, chainId)

    const isData = records === null || records.data === null ? false : true

    return (
        <Container>
            <HeaderContainer>
                <Title>
                    <Tooltip text="This will show your recent transactions with the KNC token and staking" />
                    Activity Timeline
                </Title>
                {
                    isData
                    &&
                    <ViewAllContainer onClick={() => setShowAllActivity(!showAllActivity)}>
                        { showAllActivity ? 'Show Less' : 'View All' }
                    </ViewAllContainer>
                }
            </HeaderContainer>
            {
                loading || isData === false
                    ?
                        <NoActivityContainer>
                            There is no activity to show yet.
                        </NoActivityContainer>
                    :
                        <Timeline
                            showAll={showAllActivity}
                            data={records.data}
                        />
            }
        </Container>
    )
}
