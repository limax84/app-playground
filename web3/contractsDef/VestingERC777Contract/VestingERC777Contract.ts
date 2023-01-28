import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import * as vestingContractDefPolygon from './polygon/VestingERC777Contract-polygon.json';
import * as vestingContractDefMumbai from './mumbai/VestingERC777Contract-mumbai.json';
import Contract from '../Contract';
import {RootState} from '../../../utils/redux';

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
    '137': vestingContractDefPolygon,
    '80001': vestingContractDefMumbai
}

export interface VestingWallet {
    beneficiary: string
    start: Date
    duration: number
    locked: number
    balance: number
    vested: number
    released: number
    releasable: number
}

export interface Vesting777ContractState {
    TOKEN_ADDRESS: string,
    LOCKER_ROLE: string,
    RELEASER_ROLE: string
}

const initialState: Vesting777ContractState = {
    LOCKER_ROLE: '',
    RELEASER_ROLE: '',
    TOKEN_ADDRESS: ''
}

const vestingERC777ContractSlice = createSlice({
    name: 'vestingERC777Contract',
    initialState,
    reducers: {
        setLOCKER_ROLE: (state, action: PayloadAction<string>) => {
            state.LOCKER_ROLE = action.payload
        },
        setRELEASER_ROLE: (state, action: PayloadAction<string>) => {
            state.RELEASER_ROLE = action.payload
        },
        setTOKEN_ADDRESS: (state, action: PayloadAction<string>) => {
            state.TOKEN_ADDRESS = action.payload
        }
    }
})

export default vestingERC777ContractSlice.reducer

// Vesting of ERC777 token Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class VestingERC777Contract extends Contract {

    constructor(jsonRpcProvider: any | null, chainId: string) {
        super(contractDefs[chainId], jsonRpcProvider)
    }

    getState(rootState: RootState): any {
        return rootState.vestingContract
    }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let VESTING_CONTRACT: VestingERC777Contract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_VESTING_CONTRACT = (jsonRpcProvider: any | null, chainId: string): VestingERC777Contract =>
    VESTING_CONTRACT ?
        VESTING_CONTRACT :
        (VESTING_CONTRACT = new VestingERC777Contract(jsonRpcProvider, chainId))
