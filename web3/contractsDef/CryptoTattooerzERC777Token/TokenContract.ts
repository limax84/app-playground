import ERC20Contract from '../ERC20Contract'
import * as tokenContractDefPolygon from './polygon/CryptoTattooerzERC777Token-polygon.json'
import * as tokenContractDefMumbai from './mumbai/JarvixERC777Token-mumbai.json'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
    '137': tokenContractDefPolygon,
    '80001': tokenContractDefMumbai
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export default class TokenContract extends ERC20Contract {

    static SYMBOL: string = 'NOT DEFINED'
    static IMG_URL: string = 'https://ctz-nft.jarvix.com/ipfs/QmaxNrVfRLTWBHNThsTkbFvaAqqC93k3KmuLqXFoMQ2ute'

    constructor(jsonRpcProvider: any | null, chainId: string) {
        super(contractDefs[chainId], jsonRpcProvider)
        TokenContract.SYMBOL = this.def.data.tokenSymbol
        this.addCurrency(TokenContract.SYMBOL);
    }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let TOKEN_CONTRACT: TokenContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_TOKEN_CONTRACT = (jsonRpcProvider: any | null, chainId: string): TokenContract | undefined =>
    TOKEN_CONTRACT ?
        TOKEN_CONTRACT :
        (TOKEN_CONTRACT = !contractDefs[chainId] ? undefined : new TokenContract(jsonRpcProvider, chainId))

// Add the Token to Metamask
//////////////////////////////////////////////////////////////////////////////////
export const ADD_TOKEN = () => {
    if (!TOKEN_CONTRACT)
        return
    const tokenAddress = TOKEN_CONTRACT.def.contractAddress
    const tokenSymbol = TOKEN_CONTRACT.def.data.tokenSymbol
    const tokenDecimals = 18
    const tokenImage = TokenContract.IMG_URL

    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown
        (window as any)['ethereum']?.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: tokenAddress, // The address that the token is at
                    symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars
                    decimals: tokenDecimals, // The number of decimals in the token
                    image: tokenImage, // A string url of the token logo
                }
            }
        }).then((wasAdded: any) => {
            console.log('Token ADDED !', wasAdded)
        }).catch((err: any) => {
            console.error('Token NOT ADDED !', err)
        })
    } catch (err) {
        console.error('Token NOT ADDED !', err)
    }
}
