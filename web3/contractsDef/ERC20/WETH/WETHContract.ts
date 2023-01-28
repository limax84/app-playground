import ERC20Contract from '../../ERC20Contract'
import * as wethContractDefPolygon from './polygon/ERC20_WETH-polygon.json'

const contractDefs: { [chainId: string]: any } = {
    '137': wethContractDefPolygon
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export default class WETHContract extends ERC20Contract {

    static SYMBOL: string = 'WETH'

    constructor(jsonRpcProvider: any | null, chainId: string) {
        super(contractDefs[chainId], jsonRpcProvider)
        this.addCurrency(WETHContract.SYMBOL);
    }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let WETH_CONTRACT: WETHContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_WETH_CONTRACT = (jsonRpcProvider: any | null, chainId: string): WETHContract | undefined =>
    WETH_CONTRACT ?
        WETH_CONTRACT :
        (WETH_CONTRACT = !contractDefs[chainId] ? undefined : new WETHContract(jsonRpcProvider, chainId))
