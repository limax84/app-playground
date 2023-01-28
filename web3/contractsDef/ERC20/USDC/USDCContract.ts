import ERC20Contract from '../../ERC20Contract'
import * as usdcContractDefPolygon from './polygon/ERC20_USDC-polygon.json'
import * as usdcContractDefMumbai from './mumbai/ERC20_USDC-mumbai.json'

const contractDefs: { [chainId: string]: any } = {
    '137': usdcContractDefPolygon,
    '80001': usdcContractDefMumbai
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export default class USDCContract extends ERC20Contract {

    static SYMBOL: string = 'USDC'

    constructor(jsonRpcProvider: any | null, chainId: string) {
        super(contractDefs[chainId], jsonRpcProvider)
        this.addCurrency(USDCContract.SYMBOL);
    }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let USDC_CONTRACT: USDCContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_USDC_CONTRACT = (jsonRpcProvider: any | null, chainId: string): USDCContract | undefined =>
    USDC_CONTRACT ?
        USDC_CONTRACT :
        (USDC_CONTRACT = !contractDefs[chainId] ? undefined : new USDCContract(jsonRpcProvider, chainId))
