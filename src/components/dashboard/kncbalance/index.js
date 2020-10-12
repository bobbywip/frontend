import React, { useEffect, useState, useContext } from "react"
import styled from "styled-components"

import { KNC_CONTENT } from '../../../config'
import { Doughnut } from 'react-chartjs-2'

import Tooltip from '../../common/tooltip'
import { AppStateContext } from '../../layout'
import { formatRestApiEndpoint } from '../../../utils/endpoints'

const Container = styled.div`
    background: #FFF;
    border: 1px solid #c5c5c5;
    border-radius: 16px;
    color: #000;
    padding: 2em;
    margin: 1em 1em 1em 0;
    flex: 0 1 460px;

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
const Description = styled.div`
    position: relative;
    width: 50%;
    float: right;
`
const DefaultDescription = styled.div`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.1px;
    color: #BDBDBD;
`
const ChartArea = styled.div`
`

const useGetKncDaoData = (period, chainId) => {
    const [state, setState] = useState({data: null, loading: true}) 

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        fetch(formatRestApiEndpoint(KNC_CONTENT.DAO_API_URL, chainId), {signal: signal})
            .then(res => res.json())
            .then(res => {

                let stats = {
                    burn: 0,
                    rebate: 0,
                    reward: 0
                }

                if(period === 1) {
                    stats = {
                        burn: res.data.total_burn,
                        rebate: res.data.total_rebate,
                        reward: res.data.total_reward
                    }
                } else {
                    stats = {
                        burn: res.data.current_epoch_burn,
                        rebate: res.data.current_epoch_rebate,
                        reward: res.data.current_epoch_reward
                    }
                }

                setState({data: stats, loading: false})
            })

        return function cleanup() {
            abortController.abort()
        }

    }, [period, chainId])

    return state
}

export default function KNCBalance() {
    const [period] = useState(0) //0 = all time, 1 = current epoch
    const { chainId } = useContext(AppStateContext)

    const { data, loading } = useGetKncDaoData(period, chainId)
    
    let chartData = {
        labels: [
            '% Burnt',
            '% Rebates',
            '% Rewards'
        ],
        datasets: [{
            data: [
               0,
               100,
               0
            ],
            backgroundColor: [
                '#828282',
                '#E0E0E0',
                '#BDBDBD'
            ]
        }],
    }
    const chartOptions = {
        maintainAspectRatio: 1,
        title: {
            display: false,
            text: '',
            position: 'right'
        },
        legend: {
            position: 'right',
            fontFamily: 'Helvetica Neue'
        }
    }

    if(loading === false) {
        chartData.datasets[0].data = [
            data.burn,
            data.rebate,
            data.reward
        ]
        chartData.datasets[0].backgroundColor = [
            '#212121',
            '#FFA000',
            '#FFD02A'
        ]
    }

    return (
        <Container>
            <Title>
                <Tooltip text="This shows the amount of rewards that have been burned, rebated, and rewarded since all time" />
                Total KNC Balance
            </Title>
            <Description>
                {
                    loading &&
                    <DefaultDescription>
                        No data to display.
                    </DefaultDescription>
                }
            </Description>

            <ChartArea>
                <Doughnut 
                    data={chartData}
                    options={chartOptions}
                    height={null}
                    width={null}
                />
            </ChartArea>
        </Container>
    )
}
