import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"

import { KNC_STAKING_ABI } from "../../../config"
import { AppStateContext } from "../../layout"
import { formatNumberToHuman } from "../../../utils/numbers"
import { getTokenAddresses } from "../../../utils/web3"

const Container = styled.div`
    width: inherit;
`

const GetEpochData = (web3, chainId) => {
    const [currentEpoch, setCurrentEpoch] = useState(null) 
    const [delegatedAmount, setDelegatedAmount] = useState(null) 

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

            getDelegatedAmount(epoch)
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

        getCurrentEpoch()
        
    }, [web3, chainId, currentEpoch, delegatedAmount])

    return {epoch: currentEpoch, delegated: delegatedAmount}
}

export default function DelegatedAmount() {
    const { web3, chainId } = useContext(AppStateContext);
    const { epoch, delegated } = GetEpochData(web3, chainId)

    if(!web3) {
        return(<></>)
    }

    return (
        <Container>
            Current Epoch {epoch} with {formatNumberToHuman(delegated)} KNC delegated to KCP.
        </Container>
    )
}
