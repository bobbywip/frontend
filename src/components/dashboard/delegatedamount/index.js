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

const GetEpochData = (web3, chainId) => {
    const [currentEpoch, setCurrentEpoch] = useState(null) 
    const [delegatedAmount, setDelegatedAmount] = useState(null) 
    const [epochCampaigns, setEpochCampaigns] = useState({})

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

    return {epoch: currentEpoch, delegated: delegatedAmount, campaigns: epochCampaigns}
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

export default function DelegatedAmount() {
    const { web3, chainId } = useContext(AppStateContext);
    const { epoch, delegated, campaigns } = GetEpochData(web3, chainId)

    if(!web3) {
        return(<></>)
    }

    return (
        <Container>
            Current Epoch {epoch} with {formatNumberToHuman(delegated)} KNC delegated to KCP.
            <EpochCampaignsContainer>
                {
                    campaigns.length && <RenderCampaignVotes campaigns={campaigns} />
                }
            </EpochCampaignsContainer>
        </Container>
    )
}
