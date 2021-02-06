import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"

import { KNC_STAKING_ABI, KNC_DAO_ABI } from "../../../config"
import { AppStateContext } from "../../layout"
import { formatNumberToHuman } from "../../../utils/numbers"
import { getTokenAddresses } from "../../../utils/web3"
import Tooltip from '../../common/tooltip'

const Container = styled.div`
    width: inherit;
`
const EpochCampaignsContainer = styled.div`
    display: inline-block;
`
const TimeLeftOnEpochContainer = styled.div`
    font-size: 8pt;
    display: inline-block;
`

const FIRST_EPOCH_START_TIMESTAMP = 1594710427;

const GetEpochData = (web3, chainId) => {
    const [currentEpoch, setCurrentEpoch] = useState(null) 
    const [delegatedAmount, setDelegatedAmount] = useState(null) 
    const [epochCampaigns, setEpochCampaigns] = useState({})
    const [epochInSeconds, setEpochInSeconds] = useState(0)

    useEffect(() => {
        
        async function getCurrentEpoch() {
            const { KNC_STAKING_ADDRESS } = getTokenAddresses(chainId)

            if(web3 === null) {
                console.log(`no web3 object - cannot getCurrentEpoch`)
                return
            }

            if(currentEpoch !== null) {
                return;
            }

            const stakeContract = await new web3.eth.Contract(KNC_STAKING_ABI, KNC_STAKING_ADDRESS)

            const nowTimestamp = Math.ceil(new Date().getTime() / 1000)

            // Now get the current epoch
            const epoch = await stakeContract.methods.getEpochNumber(nowTimestamp).call();
            setCurrentEpoch(epoch)

            // Get the epoch time in seconds
            const epochInSeconds = await stakeContract.methods.epochPeriodInSeconds().call();
            setEpochInSeconds(epochInSeconds);

            await getDelegatedAmount(epoch);
            await getVotedOption(epoch);
        }

        async function getDelegatedAmount(epoch) {
            const { KNC_STAKING_ADDRESS, KCSP_ADDRESS } = getTokenAddresses(chainId)

            if(web3 === null) {
                console.log(`no web3 object - cannot getDelegatedAmount`)
                return
            }

            if(epoch === null || delegatedAmount !== null) {
                return;
            }   

            const stakeContract = await new web3.eth.Contract(KNC_STAKING_ABI, KNC_STAKING_ADDRESS)
            // Now get the current delegated amount
            const amount = await stakeContract.methods.getLatestDelegatedStake(KCSP_ADDRESS).call();
            setDelegatedAmount(amount/1e18)
        }

        // Fetches the vote options for each epoch and subsequent campaign ids for said epoch
        async function getVotedOption(epoch) {
            const { KNC_DAO_ADDRESS, KCSP_ADDRESS } = getTokenAddresses(chainId)
            const daoContract = await new web3.eth.Contract(KNC_DAO_ABI, KNC_DAO_ADDRESS)
            const campaigns = await daoContract.methods.getListCampaignIDs(epoch).call();
            
            const campaignVoteOutput = [];

            await Promise.all(
                campaigns.map(async (campaign) => {
                    const votedFor = await daoContract.methods.stakerVotedOption(KCSP_ADDRESS, campaign).call();
                    campaignVoteOutput.push({cID: campaign, voted: (votedFor > 0 ? true : false), votedOption: votedFor });
                })
            );
            
            setEpochCampaigns(campaignVoteOutput);
        }

        getCurrentEpoch()
        
    }, [web3, chainId, currentEpoch, delegatedAmount])

    return {epoch: currentEpoch, delegated: delegatedAmount, campaigns: epochCampaigns, epoch_lifespan_seconds: epochInSeconds}
}

const RenderCampaignVotes = (args) => {
    const { campaigns } = args;

    if(!campaigns || campaigns.length === 0) {
        return;
    }

    return(<>
        {
            campaigns.map((c, i) => {
                return(
                    <Tooltip 
                        key={i} 
                        text={`Campaign ${c.cID} was ${c.voted ? "voted on" : "not voted on yet"}`} 
                        icon={`🗳`}
                        options={
                            {
                                bg: 'transparent',
                                opacity: (c.voted ? 1 : 0.75)
                            }
                        }
                    />
                )
            })
        }
    </>)
}

const RenderEpochEndCountdown = (currentEpoch, epochLifespanSeconds) => {
    const endTimestamp = (FIRST_EPOCH_START_TIMESTAMP + (currentEpoch * epochLifespanSeconds)); //seconds

    let timestampDiff = endTimestamp - Math.floor(new Date().valueOf()/1000.0);

    const daysDifference = Math.floor(timestampDiff/60/60/24);
    timestampDiff -= daysDifference*60*60*24
    const hoursDifference = Math.floor(timestampDiff/60/60);
    timestampDiff -= hoursDifference*60*60
    const minutesDifference = Math.floor(timestampDiff/60);
    timestampDiff -= minutesDifference*60

    const timeLeft = `${daysDifference > 0 ? [daysDifference,'days'].join(" ") : ""}
    ${hoursDifference > 0 ? [hoursDifference,'h'].join("") : ""}${' '}
    ${minutesDifference > 0 ? [minutesDifference,'m'].join("") : ""}${' '}
    left`;

    return(<TimeLeftOnEpochContainer>
        <Tooltip 
            key={`timeLeftOnEpoch`} 
            text={`Time until epoch ends`} 
            icon={`🕒`}
            options={
                {
                    bg: 'transparent'
                }
            }
        />
        {timeLeft}
    </TimeLeftOnEpochContainer>)
}

export default function DelegatedAmount() {
    const { web3, chainId } = useContext(AppStateContext);
    const { epoch, delegated, campaigns, epoch_lifespan_seconds } = GetEpochData(web3, chainId)

    if(!web3) {
        return(<></>)
    }

    return (
        <Container>
            Current Epoch {epoch} with {formatNumberToHuman(delegated)} KNC delegated to KCP.
            {RenderEpochEndCountdown(epoch, epoch_lifespan_seconds)}
            <EpochCampaignsContainer>
                {
                    campaigns.length && <RenderCampaignVotes campaigns={campaigns} />
                }
            </EpochCampaignsContainer>
        </Container>
    )
}
