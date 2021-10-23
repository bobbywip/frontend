import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    background: #FFD02A;
    width: 100%;
    min-height: 2rem;
    color: #222;
    font-weight: 800;
    text-align: center;
    font-size: 10pt;
    line-height: 2rem;
`

const Banner = () => {
    return(
        <Container>
            <span role="img" aria-label="Warning">⚠️</span> <a href="https://github.com/protofire/kyber-pool-master-proxy-contract/blob/master/audit/v1.0.0-KyberPoolSecurity.pdf" target="_blank" rel="noreferrer noopener">Sunsetting Kyber Community Pool (KCP)</a> <span role="img" aria-label="Warning">⚠️</span>
        </Container>
    )
}

export default Banner