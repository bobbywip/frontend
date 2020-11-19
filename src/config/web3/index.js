const KNC_TOKEN_ABI = require('./contracts/abis/knc_token_abi.json')
const KNC_STAKING_ABI = require('./contracts/abis/knc_staking_abi.json')
const KCSP_CONTRACT_ABI = require('./contracts/abis/kscp_abi.json')
const CONTRACT_CONFIG = require('./contracts/config.json')

const WEB3SETTINGS = {
    INFURA: {
        ID: "27e3068734924aa8801ac58cd8240715"
    },
    CONTRACTS: {
        CONTRACT_CONFIG
    }
}

export { WEB3SETTINGS, KNC_TOKEN_ABI, KNC_STAKING_ABI, KCSP_CONTRACT_ABI }