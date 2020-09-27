import * as KNC_TOKEN_ABI from './contracts/abis/knc_token_abi.json'
import * as KNC_STAKING_ABI from './contracts/abis/knc_staking_abi.json'
import {default as CONTRACT_CONFIG} from './contracts/config.json'

const WEB3SETTINGS = {
    INFURA: {
        ID: "02b145caa61b49998168f2b97d4ef323"
    },
    DELEGATION: {
        ADDRESS: "0x499b2408A0a6B43fea49Df79d98246f88ECC8465"
    },
    CONTRACTS: {
        CONTRACT_CONFIG
    }
}

export { WEB3SETTINGS, KNC_TOKEN_ABI, KNC_STAKING_ABI }