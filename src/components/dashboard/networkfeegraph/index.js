import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"

import { AppStateContext } from "../../layout"
import { WEB3SETTINGS, KNC_CONTENT } from '../../../config'
import { Line } from 'react-chartjs-2'

import Tooltip from '../../common/tooltip'

// import Pills from "../../common/pills"

const Container = styled.div`
    background: #FFF;
    border-radius: 16px;
    color: #000;
    padding: 2em;
    margin: 1em 1em 1em 0;
    flex: 1 1 400px;

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
const BodyContainer = styled.div`
    display: block;
    width: 100%;
    height: 100%;
`
const NoFeesContainer = styled.div`
    display: grid;
    place-items: center;
    overflow: auto;
    width: 100%;
    height: 100%;
    background-image: url(/empty-graph.png);
    background-repeat: no-repeat;
    background-position: left;
`
const TextContainer = styled.div`
    font-family: Helvetica Neue;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.1px;
    color: #BDBDBD;
`
const ChartContainer = styled.div`
    margin: 1.5em auto 0 auto;
    height: 300px;
`

const useGetStaker = chainId => {
    const [state, setState] = useState({data: null, loading: true}) 

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        let POOL_ADDRESS
        switch(chainId) {
          case 1:
          default:
            POOL_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.MAINNET.KCSP_ADDRESS
            break;
          case 3:
            POOL_ADDRESS = WEB3SETTINGS.CONTRACTS.CONTRACT_CONFIG.TESTNET.KCSP_ADDRESS
            break;
        }

        fetch(KNC_CONTENT.DAO_API_USER_REWARDS_URL.replace("{address}", POOL_ADDRESS), {signal: signal})
            .then(res => res.json())
            .then(res => {
                setState({data: res.data, loading: false})
            })

        return function cleanup() {
            abortController.abort()
        }

    }, [chainId])

    return state
}

export default function NetworkFeeGraph() {
    const { chainId } = useContext(AppStateContext);
    const { data, loading } = useGetStaker(chainId)

    let doDisplayGraph = false
    let chartData
    let chartOptions

    if(loading === false && data) {
        doDisplayGraph = true
        
        const dataNumbers = data.reduce((output, key) => [
            ...output,
            key["amount"]
        ], []);
        const dataLabels = data.reduce((output, key) => [
            ...output,
            key["epoch"]
        ], []);
        
        chartData = (canvas) => {
            const ctx = canvas.getContext("2d")
            const gradient = ctx.createLinearGradient(0, 0, 0, 850)
            gradient.addColorStop(0, 'rgba(255, 160, 0, 0.15)')
            gradient.addColorStop(0.5, 'rgba(255, 236, 179, 0)')
            gradient.addColorStop(1, '#FFFFFF')

            return {
                labels: dataLabels,
                datasets: [
                    {
                        label: '',
                        fill: true,
                        lineTension: 0.55,
                        backgroundColor: gradient,
                        borderColor: '#F2994A',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#FCD5B3',
                        pointBackgroundColor: '#FCD5B3',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBorderWidth: 2,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        data: dataNumbers
                    }
                ]
            }
        }

        chartOptions = {
            responsive: true,
            maintainAspectRatio: 0,
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 5,
                        stepSize: 1,
                        callback: function(label) {
                            return `${label} ETH`
                        }
                    },
                    gridLines: {
                        drawOnChartArea: false,
                        color: "rgba(0, 0, 0, 0)",
                    }
                }],
                xAxes: [{
                    gridLines: {
                        drawOnChartArea: false,
                        color: "rgba(0, 0, 0, 0)",
                    },
                    ticks: {
                        callback: function(label) {
                            return `Epoch ${label}`
                        }
                    }
                }]
            }
        }
    }


    return (
        <Container>
            <HeaderContainer>
                <Title>
                    <Tooltip text="This shows the fees that the pool has earned from each epoch" />
                    Total Fees Earned (by KCSP)
                </Title>
                {/* <Pills /> */}
            </HeaderContainer>
            <BodyContainer>
                {
                    doDisplayGraph
                    ?
                        <ChartContainer>
                            <Line 
                                data={chartData}
                                options={chartOptions}
                            />
                        </ChartContainer>
                    :
                        <NoFeesContainer>
                            <TextContainer>
                                The pool has not earned any fees yet.
                            </TextContainer>
                        </NoFeesContainer>
                }
            </BodyContainer>
        </Container>
    )
}
