import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {BigNumber} from 'ethers'
import * as priceHandlerContractDefMumbai from './mumbai/JarvixPriceHandlerMixed-mumbai.json'
import {encodeString} from '../../../utils/helpers/utils'
import Contract from '../Contract'
import {RootState} from '../../../utils/redux'
import {CURRENCIES} from '../ERC20Contract';

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': priceHandlerContractDefMumbai
}

export interface IPriceDiscount {
  decimals: number
  endingAmountUSD: number
  maxDiscountRate: number
}

export interface ICurrencyPriceData {
  decimals: number
  decimalsUSD: number
  priceUSD: number
}

export interface PriceHandlerContractState {
  DEFAULT_ADMIN_ROLE: string
  PRICES_ADMIN_ROLE: string
  currencies: string[]
  currenciesPriceData: { [currency: string]: ICurrencyPriceData }
  priceDiscount: IPriceDiscount
}

const initialState: PriceHandlerContractState = {
  DEFAULT_ADMIN_ROLE: '',
  PRICES_ADMIN_ROLE: '',
  currencies: [],
  currenciesPriceData: {},
  priceDiscount: {
    endingAmountUSD: 0,
    maxDiscountRate: 0,
    decimals: 0
  }
}

const priceHandlerContractSlice = createSlice({
  name: 'priceHandlerNFTContract',
  initialState,
  reducers: {
    setDEFAULT_ADMIN_ROLE: (state, action: PayloadAction<string>) => {
      state.DEFAULT_ADMIN_ROLE = action.payload
    },
    setPRICES_ADMIN_ROLE: (state, action: PayloadAction<string>) => {
      state.PRICES_ADMIN_ROLE = action.payload
    },
    setCurrencies: (state, action: PayloadAction<string[]>) => {
      state.currencies = action.payload
    },
    setCurrenciesPriceData: (state, action: PayloadAction<{ [currency: string]: ICurrencyPriceData }>) => {
      state.currenciesPriceData = action.payload
    },
    setPriceDiscount: (state, action: PayloadAction<IPriceDiscount>) => {
      state.priceDiscount = action.payload
    }
  }
})

export const getPriceHandlerContractState = (state: RootState) => state.priceHandlerNFTContract

export default priceHandlerContractSlice.reducer

// Contract SINGLETON class
//////////////////////////////////////////////////////////////////////////////////
export class PriceHandlerNFTContract extends Contract {

  static ROLE_NAMES = ['DEFAULT_ADMIN_ROLE', 'PRICES_ADMIN_ROLE']

  setDEFAULT_ADMIN_ROLE = priceHandlerContractSlice.actions.setDEFAULT_ADMIN_ROLE
  DEFAULT_ADMIN_ROLE = (state: RootState) => state.priceHandlerContract.DEFAULT_ADMIN_ROLE
  setPRICES_ADMIN_ROLE = priceHandlerContractSlice.actions.setPRICES_ADMIN_ROLE
  PRICES_ADMIN_ROLE = (state: RootState) => state.priceHandlerContract.PRICES_ADMIN_ROLE
  setCurrencies = priceHandlerContractSlice.actions.setCurrencies
  currencies = (state: RootState) => state.priceHandlerContract.currencies
  setCurrenciesPriceData = priceHandlerContractSlice.actions.setCurrenciesPriceData
  currenciesPriceData = (state: RootState) => state.priceHandlerContract.currenciesPriceData
  setPriceDiscount = priceHandlerContractSlice.actions.setPriceDiscount
  priceDiscount = (state: RootState) => state.priceHandlerContract.priceDiscount

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

  getState(rootState: RootState): any {
  }

  // Update the Wallet Data
  //////////////////////////////////////////////////////////////////////////////
  update = (dispatch: any) => {

    // Update BUYING CURRENCIES' DATA
    //--------------------------------------------------------
    this.contract?.getTokenCountFully().then((tokenCount: BigNumber) => {
      const _currencies: string[] = []
      const _currenciesPriceData: { [currency: string]: ICurrencyPriceData } = {}
      Promise.all(
        [...Array(tokenCount.toNumber()), 'COIN', 'NFT'].map((_, currencyIndex: number) =>
          (currencyIndex < tokenCount.toNumber() ?
              this.contract?.getTokenFully(currencyIndex) :
              currencyIndex < tokenCount.toNumber() + 1 ?
                Promise.resolve(encodeString('COIN')) :
                Promise.resolve(encodeString('NFT'))
          ).then((encodedCurrency: string) => {
              const currency = CURRENCIES[encodedCurrency]
              _currencies.push(currency)
              return Promise.all([
                this.contract?.getPriceData(encodedCurrency).then((data: any) =>
                  _currenciesPriceData[currency] = {
                    decimals: data.decimals,
                    priceUSD: data.priceUSD.value.toNumber(),
                    decimalsUSD: data.priceUSD.decimals
                  })
              ])
            }
          )
        )
      ).then(() => {
        console.log('dispatch currenciesPriceData', _currenciesPriceData)
        dispatch(this.setCurrenciesPriceData(_currenciesPriceData))
        console.log('dispatch currencies', _currencies)
        dispatch(this.setCurrencies(_currencies))
      })
    })


    // Update PRICE DISCOUNT
    //--------------------------------------------------------
    this.contract?.getTokenPriceDiscount().then((priceDiscount: any) =>
      dispatch(this.setPriceDiscount({
        endingAmountUSD: priceDiscount.endingAmountUSD.toNumber(),
        maxDiscountRate: priceDiscount.maxDiscountRate.value,
        decimals: priceDiscount.maxDiscountRate.decimals
      }))
    )

  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let PRICE_HANDLER_NFT_CONTRACT: PriceHandlerNFTContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_PRICE_HANDLER_NFT_CONTRACT = (jsonRpcProvider: any | null, chainId: string): PriceHandlerNFTContract =>
  PRICE_HANDLER_NFT_CONTRACT ?
    PRICE_HANDLER_NFT_CONTRACT :
    (PRICE_HANDLER_NFT_CONTRACT = new PriceHandlerNFTContract(jsonRpcProvider, chainId))
