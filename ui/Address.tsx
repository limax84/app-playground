import {toast} from 'react-toastify';
import {cropAddress} from '#/utils/utils';

const I18N: any = {
  fr: {
    address: "Copier l'adresse dans le presse-papier",
    copy: 'Adresse copiée dans le Presse-papier !',
    altLogo: 'Aller sur PolygonScan (nouvel onglet)',
  },
  en: {
    address: 'Copy address in the clipboard',
    copy: 'Address copied to clipboard!',
    altLogo: 'Go to PolygonScan (new tab)',
  },
}

// Display Address
////////////////////////////////////////////////////////////////////////
export default function Address(props: any) {

  // Address copy to clipboard
  //////////////////////////////////////////////////////////////
  const handleCopy = (address: any) => {
    navigator.clipboard.writeText(String(address))
    toast('Copy', {autoClose: 500})
  }

  // Component rendering
  ////////////////////////////////////////////////////////////////////////
  return (
    <div className="inline-flex items-center border-[1px] border-white rounded-full px-3">
      {/*<a*/}
      {/*  href={(network.blockExplorerUrls[0] + props.children).toString()}*/}
      {/*  target="_blank"*/}
      {/*  rel="noopener noreferrer"*/}
      {/*  className="mr-2 inline-flex h-4 w-4 shrink-0 items-center"*/}
      {/*  title={wording.altLogo}*/}
      {/*>*/}
      {/*  <Image src={network.logo || imgs.logoPolygon} alt={wording.altLogo} />*/}
      {/*</a>*/}

      <span
        className={'font-mono cursor-pointer'}
        onClick={() => handleCopy(props.children)}
      >
        {cropAddress(props.children)}
      </span>
    </div>
  )
}
