import {encodeString, expose, hexToDec, hexToUtf8} from '#/utils/utils'

const GET_ERROR_FUNCTION = (errorFunctionName: string) => {
  return {
    name: errorFunctionName,
    encoded: encodeString(errorFunctionName)
  }
}

const GET_ERROR_FUNCTIONS = (errorFunctionNames: string[]) => errorFunctionNames.map((errorFunctionName: string) => GET_ERROR_FUNCTION(errorFunctionName))

// TODO Comment
// -------------------------------------------------------
const ERROR_FUNCTION_NAMES = [

  // Generic string error
  'Error(string)',

  // AccessControl.sol
  'AccessControl_MissingRole(address,bytes32)',

  // JarvixERC721Token.sol errors
  'JVX_ERC721_CapExceeded()',
  'JVX_ERC721_NonexistentToken(uint256)',
  'JVX_ERC721_ExistentToken(uint256)',
  'JVX_ERC721_BurnNotAllowed(address,uint256)',
  'JVX_ERC721_MintIsNotReady()',
  'JVX_ERC721_WrongParams()',

  // JarvixERC721Minter.sol errors
  'JVX_ERC721_SetIDNotAllowed()',
  'JVX_ERC721_SetURINotAllowed()',

  // IntegrationTest.sol errors
  'Error_string(uint256,string)',
  'Error_bool(uint256,bool)',
  'Error_address(uint256,address)',
  'Error_bytes4(uint256,bytes4)',
  'Error_bytes32(uint256,bytes32)',
  'Error_bytes(uint256,bytes)',
  'Error_int8(uint256,int8)',
  'Error_int32(uint256,int32)',
  'Error_int64(uint256,int64)',
  'Error_int256(uint256,int256)',
  'Error_uint8(uint256,uint8)',
  'Error_uint32(uint256,uint32)',
  'Error_uint64(uint256,uint64)',
  'Error_uint256(uint256,uint256)',
  'Error_Struct(uint256,(uint256,uint8))',
  'Error_Enum(uint256,uint8)',
  'Error_Array(uint256,string[])'
]

// TODO Comment
// ------------------------------------------------------------------------
export enum IntegrationTestEnum { VALUE1, VALUE2, VALUE3 }

/**
 * getRevertErrorMessage
 * @param err The error from which data should be extracted
 * @return The extracted revert error message
 */
const logs = false
export const getRevertErrorMessage = (err: any, errorFunctionNames?: string[]) => {
  if (logs) {
    expose('err', err)
    console.log('>>> getErrorMessage')
  }

  // Get DATA
  let data = err?.error?.data?.data || err?.data?.data || err?.data || (typeof err === 'string' ? err : null)
  if (logs) console.log('>> Data:', data)
  if (!data || data.length === 0)
    return 'Error: No error data found'
  if (logs) console.log('>> Data found:', data)

  // Check DATA
  if (data.indexOf('0x') !== 0 || data.lastIndexOf('0x') !== 0)
    return 'Error: Data not hexadecimal'

  // Remove hexadecimal prefix
  data = data.substring('0x'.length)
  if (logs) console.log('>> Data hexa trimmed:', data)

  // FUNCTION SELECTOR : Get first 4 bytes (8 hexadecimal characters)
  const encodedFunctionSelector = data.substring(0, 8)
  if (logs) console.log('>> Data encodedFunctionSelector:', encodedFunctionSelector)
  const _function = GET_ERROR_FUNCTIONS(ERROR_FUNCTION_NAMES.concat(errorFunctionNames || []))
    .find((_funct: any) => _funct.encoded.indexOf(encodedFunctionSelector) === '0x'.length)
  if (!_function)
    return 'Error: Data function unknown'
  if (logs) console.log('>> Data function name:', _function?.name)

  // Error(string)
  // --------------------------------------------------------------------------
  if (_function?.name === 'Error(string)') {

    // DATA OFFSET : Get next 32 bytes (64 hexadecimal characters)
    const dataOffsetHex = data.substring(8, 8 + 64)
    if (!dataOffsetHex)
      return 'Error: Data dataOffset not fount'
    if (logs) console.log('>> Data dataOffset (hex):', dataOffsetHex)
    const dataOffset = parseInt(dataOffsetHex, 16)
    if (!dataOffset)
      return 'Error: Data could not decode dataOffsetHex'
    if (logs) console.log('>> Data dataOffset (dec):', dataOffset)

    // STRING LENGTH : Get next 32 bytes (64 hexadecimal characters)
    const stringLengthHex = data.substring(8 + 64, 8 + 64 + 64)
    if (!stringLengthHex)
      return 'Error: Data stringLength not fount'
    if (logs) console.log('>> Data stringLength (hex):', stringLengthHex)
    const stringLength = parseInt(stringLengthHex, 16)
    if (!stringLength)
      return 'Error: Data could not decode stringLengthHex'
    if (logs) console.log('>> Data stringLength (dec):', stringLength)

    // DATA STRING : Get next [dataOffset] bytes (2 x [dataOffset] hexadecimal characters)
    const dataStringHex = data.substring(8 + 64 + 64, 8 + 64 + 64 + (2 * stringLength))
    if (!dataStringHex)
      return 'Error: Data dataString not fount'
    if (logs) console.log('>> Data dataString (hex):', dataStringHex)
    const dataString = hexToUtf8(dataStringHex)
    if (!dataString)
      return 'Error: Data could not decode dataStringHex'
    if (logs) console.log('>> Data dataString (str):', dataString)
    if (logs) console.log('>> Data dataString (str.length):', dataString.length)

    // Trim end of string
    const message = dataString.substring(0, stringLength)
    if (logs) console.log('>> Data message [' + message.length + ']:', message)

    // Return MESSAGE
    return message
  }

    // Custom Errors
  // --------------------------------------------------------------------------
  else {

    // Get ARGS
    const args = _function?.name
      .substring((_function?.name?.lastIndexOf('(') || 0) + 1, _function?.name?.lastIndexOf(')'))
      .split(',')
      .filter((argType: string) => argType?.length > 0)
      .map((argType: string, index: number) => {
        const value = data.substring(8 + (index * 64), 8 + (index * 64) + 64)
        return {
          type: argType,
          value: argType === 'uint256' ? parseInt(value) :
            argType === 'address' ? '0x' + value.substring(64 - 40) : value
        }
      })
    if (logs) console.log('ARGS:', args)

    // Build FUNCTION NAME with ARGS
    let functionName = _function?.name.substring(0, _function?.name.lastIndexOf('(')) +
      '(' +
      args?.map(arg => arg.value).join(', ') +
      ')'
    if (logs) console.log('functionName:', functionName)

    // Return MESSAGE
    return 'Custom Error: ' + functionName

  }
}
expose('getRevertErrorMessage', getRevertErrorMessage)
expose('hexToDec', hexToDec)
expose('hexToUtf8', hexToUtf8)
