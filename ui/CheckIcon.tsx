export function CheckIcon(props: { w: number, h: number }) {

  const getWidth = (): number => props.w || 32
  const getHeight = (): number => props.h || 32

  return (
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 256 256"
         width={getWidth() + 'px'} height={getHeight() + 'px'}>
      <rect width="256" height="256" fill="none"/>
      <polyline fill="none" stroke="#00CC00" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" points="216 72.005 104 184 48 128.005"/>
    </svg>
  );
}
