import React from "react"
import styled from "styled-components"
import PropTypes from 'prop-types';

import { KNC_CONTENT } from "../../../../config"

import RedeemIcon from "../../../../static/activity/redeem.png"
import WithdrawIcon from "../../../../static/activity/withdraw.png"
import DepositIcon from "../../../../static/activity/deposit.png"

Timeline.propTypes = {
    showAll: PropTypes.bool,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            timestamp: PropTypes.number.isRequired,
            epoch: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            tx_hash: PropTypes.string.isRequired,
            meta: PropTypes.shape({
                amount: PropTypes.number,
                
                campaign_id: PropTypes.number,
                campaign_type: PropTypes.string,
                option: PropTypes.string,
                option_desc: PropTypes.string,
            })
        })
    )
}

Timeline.defaultProps = {
    showAll: false,
    data: []
}

const Container = styled.div`
    display: block;

    ${props => props.showAll === false
        &&
        `
            max-height: 291px;
            height: 291px;
            overflow-y: hidden;
        `
    }
`

const Row = styled.div`
    display: table;
    width: 100%;
    border-top: 2px solid #E5E5E5;
`
const Part = styled.div`
    display: table-cell;
    padding: 0.5em 0;
    vertical-align: middle;

    &:nth-child(1), &:nth-child(3) {
        width: 60px;
    }
`

const Icon = styled.img`
    width: 36px;
    height: 36px;
    margin: auto;
`
const DateTimestamp = styled.span`
    font-size: 10px;
`

export default function Timeline(props) {
    const { showAll, data } = props

    if(data === null) {
        return <></>
    }

    let records = data

    if(showAll === false) {
        records = data.slice(0, 6)
    }

    return (
        <Container>
            {
                records.map((activity) => {

                    let iconSrc
                    let type
                    let description
                    switch(activity.type.toLowerCase()) {
                        case 'withdraw' :
                            type = "Withdraw"
                            iconSrc = WithdrawIcon
                            description = "{amount} KNC withdrawn from the pool."
                        break;
                        case 'deposit' :
                            type = "Deposit"
                            iconSrc = DepositIcon
                            description = "{amount} KNC tokens deposited to the pool."
                        break;
                        case 'claimreward' :
                            type = "Claimed Reward"
                            iconSrc = RedeemIcon
                            description = "{amount} ETH redeemed from the Total Fee Earned."
                        break;
                        default :
                            // VoteCampaign
                            iconSrc = null;
                        break;
                    }

                    if(iconSrc === null || !activity.hasOwnProperty('meta') || !activity.meta.hasOwnProperty('amount')) {
                        return null
                    }

                    const formattedValue = activity.meta.amount > 999 
                        ? Math.sign(activity.meta.amount) * ((Math.abs(activity.meta.amount)/1000).toFixed(1)) + `k` 
                        : Math.sign(activity.meta.amount) * Math.abs(activity.meta.amount)


                    const getRelativeTime = dateTimestamp => {
                        let now = new Date(),
                        secondsPast = (now.getTime() - dateTimestamp.getTime() ) / 1000;
                        if(secondsPast < 60){
                            return `just now`
                        }
                        if(secondsPast < 3600){
                            return `${parseInt(secondsPast/60)}m`
                        }
                        if(secondsPast <= 86400){
                            return `${parseInt(secondsPast/3600)}h`
                        }
                        if(secondsPast > 86400) {
                            if(secondsPast < 604800) {
                                return `${parseInt(secondsPast/86400)}d`
                            }
                            return `${parseInt(secondsPast/604800)}w`
                        }
                    }


                    return(
                        <Row key={activity.tx_hash}>
                            <Part>
                                <Icon src={iconSrc} title={type} alt={type} />
                            </Part>
                            <Part>
                                {description.replace("{amount}", formattedValue.toFixed(2))}
                            </Part>
                            <Part>
                                <DateTimestamp>
                                    <a href={KNC_CONTENT.BLOCK_EXPLORER.replace("{hash}", activity.tx_hash)} target="_blank" rel="noopener noreferrer">
                                        {getRelativeTime(new Date(activity.timestamp*1000))}
                                    </a>
                                </DateTimestamp>
                            </Part>
                        </Row>
                    )
                })
            }
        </Container>
    )
}