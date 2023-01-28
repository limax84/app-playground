import ERC20Contract from '../../ERC20Contract'
import * as usdtContractDefPolygon from './polygon/ERC20_USDT-polygon.json'

const contractDefs: { [chainId: string]: any } = {
    '137': usdtContractDefPolygon
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export default class USDTContract extends ERC20Contract {

    static SYMBOL: string = 'USDT'

    constructor(jsonRpcProvider: any | null, chainId: string) {
        super(contractDefs[chainId], jsonRpcProvider)
        this.addCurrency(USDTContract.SYMBOL);
    }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let USDT_CONTRACT: USDTContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_USDT_CONTRACT = (jsonRpcProvider: any | null, chainId: string): USDTContract | undefined =>
    USDT_CONTRACT ?
        USDT_CONTRACT :
        (USDT_CONTRACT = !contractDefs[chainId] ? undefined : new USDTContract(jsonRpcProvider, chainId))
