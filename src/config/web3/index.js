const KNC_TOKEN_ABI = require('./contracts/abis/knc_token_abi.json')
const KNC_STAKING_ABI = require('./contracts/abis/knc_staking_abi.json')
const KCSP_CONTRACT_ABI = require('./contracts/abis/kscp_abi.json')
const KNC_DAO_ABI = require('./contracts/abis/knc_dao_abi.json')
const CONTRACT_CONFIG = require('./contracts/config.json')

const WEB3SETTINGS = {
    RPC_PROXY: "https://kybercommunitypool-app.herokuapp.com/",
    CONTRACTS: {
        CONTRACT_CONFIG
    },
    KCP: {
        DEPLOYED_EPOCH: 7
    }
}

export { WEB3SETTINGS, KNC_TOKEN_ABI, KNC_STAKING_ABI, KCSP_CONTRACT_ABI, KNC_DAO_ABI }