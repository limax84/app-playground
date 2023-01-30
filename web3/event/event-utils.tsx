import {Event} from '#/web3/event/Event';
import {decodedValue} from '#/web3/web3-utils';
import {getBlock} from '#/web3/block/Blocks';
import {IWeb3Context} from '#/web3/web3-context';


/**
 * PROCESS a RAW Event
 * @param rawEvent
 */
const logs = false
export const processEvent = async (rawEvent: any, provider: any, web3Context: IWeb3Context): Promise<Event> => {
  if (logs) console.log('##### Process Event #####')
  if (logs) console.log('# Raw Event: ', rawEvent)
  const eventSignature = rawEvent.eventSignature
  if (logs) console.log('# Event signature: ', eventSignature)
  const argsTypes = eventSignature.substring(eventSignature.indexOf('(') + 1, eventSignature.lastIndexOf(')')).split(',')
  if (logs) console.log('# Event argsTypes: ', argsTypes)
  let decoded: any
  try {
    decoded = rawEvent.decode(rawEvent.data, rawEvent.topics)
  } catch (e) {
    console.warn('DECODE ERROR', e)
    return null as any
  }
  if (logs) console.log('# Decoded: ', decoded)
  decoded.map((item: any, key: any) => {
    if (logs) console.log('# Decoded item [' + key + ']: ', item, '(' + typeof item + ')')
  })
  const eventArgs = Object.keys(decoded)
    .slice(Object.keys(decoded).length / 2)
    .map((key: string, index: number) => {
      return {
        key: key,
        type: argsTypes[index],
        value: decodedValue(decoded[key], argsTypes[index])
      }
    })
  if (logs) console.log('# Event args: ', eventArgs)
  const processedEvent: Event = {
    name: rawEvent.eventSignature.substring(0, rawEvent.eventSignature.indexOf('(')),
    signature: rawEvent.eventSignature,
    args: eventArgs,
    timestamp: ((await getBlock(rawEvent.blockNumber, provider, web3Context))?.timestamp || 0),
    blockNumber: rawEvent.blockNumber
  }
  if (logs) console.log('# Processed Event: ', processedEvent, rawEvent)
  return processedEvent
}
