import {BigNumber, ethers} from 'ethers';

// Expose globally the given object with the given name
//////////////////////////////////////////////////////////////
export const expose = (name: string, obj: any) => {
  if (isBrowser())
    (window as any)[name] = obj
}

// Throw the error message if the given assertion is false
//////////////////////////////////////////////////////////////
export const check = (assertion: boolean, errorMessage: string) => {
  if (!assertion) throw errorMessage
}

// Add the method 'capitalize' to string objects
//////////////////////////////////////////////////////////////
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

// Return true if an admin user is connected
//////////////////////////////////////////////////////////////
export const isAdmin = (user: any) => user && Array.isArray(user.roles) && user.roles.includes('ADMIN')

// Return true if executed on browser
//////////////////////////////////////////////////////////////
export const isBrowser = () => typeof window !== 'undefined'

// Address cropping
//////////////////////////////////////////////////////////////
export const cropAddress = (address: any) => {
  const addr = String(address)
  if (!isHex(addr)) return addr
  return addr.substring(0, 5) + '...' + addr.substring(addr.length - 4)
}

// number / BigNumber conversion
//////////////////////////////////////////////////////////////
export const numberToBigNumber = (amount: number, decimals: number) => {
  return BigNumber.from(Math.floor(amount * Math.pow(10, decimals)).toLocaleString('fullwide', {useGrouping: false}))
}
export const bigNumberToNumber = (amount: number | any, decimals: number = 0, nbFDigits: number = 6) => {
  if (amount == 0 || amount === '0')
    return 0
  if (typeof amount === 'number')
    return amount / Math.pow(10, decimals)
  amount = amount.toString()
  amount = amount.substring(0, amount.length - Math.max(0, decimals - nbFDigits))
  return Number.parseFloat(amount) / Math.pow(10, Math.min(decimals, nbFDigits))
}

// Amount formatting
//////////////////////////////////////////////////////////////
export const formatAmount = (amount: number | any, decimals: number = 0, nbFDigits: number = 3) => {
  amount = amount ? amount : 0
  return bigNumberToNumber(amount, decimals, nbFDigits).toFixed(nbFDigits)
}

// String parameter encoding
//////////////////////////////////////////////////////////////
export const isHex = (str: string) => {
  return str == null || str.match("0x[0-9a-fA-F]+")
}
export const encodeString = (str: string) => {
  if (isHex(str)) return str
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(String(str)))
}

// Decimal number/string TO Hexadecimal string
//////////////////////////////////////////////////////////////
export const decToHex = (input: number | string) => {
  return '0x' + parseInt(input.toString(), 10).toString(16)
}

// Hexadecimal string TO Decimal string
//////////////////////////////////////////////////////////////
export const hexToDec = (input: string) => {
  return parseInt(input, 16).toString(10)
}

// Hexadecimal string TO UTF8 string
//////////////////////////////////////////////////////////////
export const hexToUtf8 = (s: string) => {
  let r = []
  for (let i = 0; i < s.length - 1; i += 2) {
    r.push(String.fromCharCode(parseInt(s.charAt(i) + s.charAt(i + 1), 16)))
  }
  return r.join('')
}

// String TO Bytes32
//////////////////////////////////////////////////////////////
export const stringToBytes32 = (str: string): string => {
  let strLength = str.length;
  let result = '';
  for (let i = 0; i < 32; i++) {
    if (i < strLength) {
      result += str.charCodeAt(i).toString(16);
    } else {
      result += '00';
    }
  }
  return '0x' + result;
}

// String TO Bytes4
//////////////////////////////////////////////////////////////
export const stringToBytes4 = (str: string) => {
  let data = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    data[i] = str.charCodeAt(i)
  }
  return data.slice(0, 4)
}

// String TO Uint8
//////////////////////////////////////////////////////////////
export const stringToUint8 = (str: string) => {
  let data = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    data[i] = str.charCodeAt(i)
  }
  return data
}

//
export const pause = (delayInMs: number) => {
  console.log('Pause start (' + delayInMs + 'ms)')
  return new Promise<void>(async (resolve) => {
    setTimeout(() => {
      console.log('Pause end')
      resolve()
    }, delayInMs)
  })
}
