import {useState} from 'react';
import {formatDt} from '#/utils/utils';

/**
 * TODO Comment
 */
export interface Event {
  name: string,
  signature: string,
  args: any[],
  blockNumber: number,
  timestamp: number
}

/**
 * TODO Comment
 * @param props
 * @constructor
 */
export const EventItem = (props: { event: Event }) => {

  const [showDetails, setShowDetails] = useState<boolean>(false)

  return (
    <div className={'flex flex-col gap-2 w-full text-sm font-normal odd:bg-white/[0.03]'}>
      <div className={'flex items-center gap-2 w-full cursor-pointer opacity-80 hover:opacity-100 hover:bg-white/5 px-2 py-1'} onClick={() => setShowDetails(!showDetails)}>
        <div className={'transition-all ' + (showDetails ? 'rotate-90' : 'rotate-270')}>➧</div>
        <div className={'whitespace-nowrap'}>{formatDt(props.event.timestamp)}</div>
        <div className={''}>{'-'}</div>
        <div className={''}>{props.event.signature}</div>
        <div className={''}>{'-'}</div>
        <div className={'text-ellipsis overflow-hidden whitespace-nowrap'}>{props.event.args.find((arg: any) => arg.key === 'message')?.value?.toString() || 'No message event arg'}</div>
      </div>
      <div className={'flex-col mb-2 ' + (showDetails ? ('flex') : ('hidden'))}>
        <textarea rows={10}
                  wrap=""
                  className={'noScrollBar w-full font-semibold text-xs rounded-md bg-white/5 border-white/5 overflow-auto whitespace-pre shadow-insetDarkStrong'}
                  value={JSON.stringify(props.event, null, 2)}
                  readOnly={true}></textarea>
      </div>
    </div>
  )
}
