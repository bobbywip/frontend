export const formatRestApiEndpoint = (url, chainId) => {
    // mapping
    const find = [
        "api.kyber.org",
        "etherscan.io"
    ]
    const replace = [
        "ropsten-api.kyber.org",
        "ropsten.etherscan.io"
    ]

    // Not on mainnet
    if(chainId === 3) {
        find.forEach((f,k) => {
            url = url.replace(f, replace[k])
        })
    }
    
    return url
}
