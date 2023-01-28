import Image from 'next/image';

export function LoadingIcon(props: { className?: string, h: number, w: number }) {

  const getWidth = (): number => props.w || 32
  const getHeight = (): number => props.h || 32

  return (
    <Image src={'/ajax-spinner.gif'}
           alt={'Loading...'}
           className={' ' + (props.className ? props.className : '')}
           style={{width: getWidth(), height: getHeight()}}
           height={getHeight()}
           width={getWidth()}/>
  );
}
