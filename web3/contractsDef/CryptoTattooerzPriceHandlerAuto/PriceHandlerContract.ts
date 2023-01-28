import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {BigNumber} from 'ethers'
import * as priceHandlerContractDefPolygon from './polygon/CryptoTattooerzPriceHandlerAuto-polygon.json'
import * as priceHandlerContractDefMumbai from './mumbai/JarvixPriceHandlerAuto-mumbai.json'
import {encodeString} from '../../../utils/helpers/utils'
import Contract from '../Contract'
import {RootState} from '../../../utils/redux'
import {CURRENCIES} from '../ERC20Contract';

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '137': priceHandlerContractDefPolygon,
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

export interface ICurrencyData {
  decimals: number
  usdAggregatorV3Address: string
}

export interface PriceHandlerContractState {
  DEFAULT_ADMIN_ROLE: string
  PRICES_ADMIN_ROLE: string
  currencies: string[]
  currenciesData: { [currency: string]: ICurrencyData }
  currenciesPriceData: { [currency: string]: ICurrencyPriceData }
  priceDiscount: IPriceDiscount
}

const initialState: PriceHandlerContractState = {
  DEFAULT_ADMIN_ROLE: '',
  PRICES_ADMIN_ROLE: '',
  currencies: [],
  currenciesData: {},
  currenciesPriceData: {},
  priceDiscount: {
    endingAmountUSD: 0,
    maxDiscountRate: 0,
    decimals: 0
  }
}

const priceHandlerContractSlice = createSlice({
  name: 'priceHandlerContract',
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
    setCurrenciesData: (state, action: PayloadAction<{ [currency: string]: ICurrencyData }>) => {
      state.currenciesData = action.payload
    },
    setCurrenciesPriceData: (state, action: PayloadAction<{ [currency: string]: ICurrencyPriceData }>) => {
      state.currenciesPriceData = action.payload
    },
    setPriceDiscount: (state, action: PayloadAction<IPriceDiscount>) => {
      state.priceDiscount = action.payload
    }
  }
})

export const getPriceHandlerContractState = (state: RootState) => state.priceHandlerContract

export default priceHandlerContractSlice.reducer

// Contract SINGLETON class
//////////////////////////////////////////////////////////////////////////////////
export class PriceHandlerContract extends Contract {

  static ROLE_NAMES = ['DEFAULT_ADMIN_ROLE', 'PRICES_ADMIN_ROLE']

  setDEFAULT_ADMIN_ROLE = priceHandlerContractSlice.actions.setDEFAULT_ADMIN_ROLE
  DEFAULT_ADMIN_ROLE = (state: RootState) => state.priceHandlerContract.DEFAULT_ADMIN_ROLE
  setPRICES_ADMIN_ROLE = priceHandlerContractSlice.actions.setPRICES_ADMIN_ROLE
  PRICES_ADMIN_ROLE = (state: RootState) => state.priceHandlerContract.PRICES_ADMIN_ROLE
  setCurrencies = priceHandlerContractSlice.actions.setCurrencies
  currencies = (state: RootState) => state.priceHandlerContract.currencies
  setCurrenciesData = priceHandlerContractSlice.actions.setCurrenciesData
  currenciesData = (state: RootState) => state.priceHandlerContract.currenciesData
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
    this.contract?.getTokenCount().then((tokenCount: BigNumber) => {
      const _currencies: string[] = []
      const _currenciesData: { [currency: string]: ICurrencyData } = {}
      const _currenciesPriceData: { [currency: string]: ICurrencyPriceData } = {}
      Promise.all(
        [...Array(tokenCount.toNumber()), 'COIN', 'TOKEN'].map((_, currencyIndex: number) =>
          (currencyIndex < tokenCount.toNumber() ?
              this.contract?.getToken(currencyIndex) :
              currencyIndex < tokenCount.toNumber() + 1 ?
                Promise.resolve(encodeString('COIN')) :
                Promise.resolve(encodeString('TOKEN'))
          ).then((encodedCurrency: string) => {
              const currency = CURRENCIES[encodedCurrency]
              _currencies.push(currency)
              return Promise.all([
                this.contract?.getPriceData(encodedCurrency).then((data: any) =>
                  _currenciesPriceData[currency] = {
                    decimals: data.decimals,
                    priceUSD: data.priceUSD.value.toNumber(),
                    decimalsUSD: data.priceUSD.decimals
                  }),
                this.contract?.getCurrencyData(encodedCurrency).then((data: any) =>
                  _currenciesData[currency] = {
                    decimals: data.decimals,
                    usdAggregatorV3Address: data.usdAggregatorV3Address
                  }
                )
              ])
            }
          )
        )
      ).then(() => {
        console.log('dispatch currenciesData', _currenciesData)
        dispatch(this.setCurrenciesData(_currenciesData))
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
let PRICE_HANDLER_CONTRACT: PriceHandlerContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_PRICE_HANDLER_CONTRACT = (jsonRpcProvider: any | null, chainId: string): PriceHandlerContract =>
  PRICE_HANDLER_CONTRACT ?
    PRICE_HANDLER_CONTRACT :
    (PRICE_HANDLER_CONTRACT = new PriceHandlerContract(jsonRpcProvider, chainId))
