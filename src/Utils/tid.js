import { Principal } from '@dfinity/principal';

export function computeExtTokenIdentifier(index, principal) {
    let identifier = new Uint8Array([10, 116, 105, 100]);
  
    const principalBytes = Principal.fromText(principal).toUint8Array();
    identifier = new Uint8Array([...identifier, ...principalBytes]);
  
    let rest = index;
    for (let i = 3; i >= 0; i--) {
      const power2 = Math.pow(2, i * 8);
      const val = Math.floor(rest / power2);
      identifier = new Uint8Array([...identifier, val]);
      rest -= val * power2;
    }
  
    const finalPrincipal = Principal.fromUint8Array(identifier);
    return finalPrincipal.toText();
  }


  export function getTokenIndex(finalPrincipal, principal) {
    const identifier = Principal.fromText(finalPrincipal).toUint8Array();
    const principalBytes = Principal.fromText(principal).toUint8Array();
  
    // The index is stored in the last 4 bytes of the identifier
    let index = 0;
    for (let i = 0; i < 4; i++) {
      index = (index << 8) | identifier[identifier.length - 4 + i];
    }
  
    // Verify the principal part
    const expectedIdentifier = new Uint8Array([10, 116, 105, 100, ...principalBytes]);
    for (let i = 0; i < expectedIdentifier.length; i++) {
      if (identifier[i] !== expectedIdentifier[i]) {
        throw new Error("Invalid finalPrincipal or principal");
      }
    }
  
    return index;
  }




  export const shortenAddress = (address) => {
    return `${address?.slice(0, 14)}...${address?.slice(-4)}`;
  };

  export const convertExpiryDate = (expiry) => {
    const date = new Date(Number(expiry) / 1e6);
    return date.toLocaleString(); // Adjust options as needed for formatting
  };