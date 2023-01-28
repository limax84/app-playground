import Image from 'next/image';

export function JarvixLogo(props: { className?: string }) {
  return (
    <Image src={'/jarvix-logo-color.png'}
           alt={'Jarvix Logo Color'}
           className={props.className ? props.className : ''}
           height={24}
           width={24}/>
  );
}
