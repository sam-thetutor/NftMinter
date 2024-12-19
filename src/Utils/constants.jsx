export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  export function isPrincipalOrAccount(address) {
    // Principal addresses typically contain dashes and are 63 characters long
    const principalRegex = /^[a-z0-9\-]{63}$/;
    
    // Account identifiers are typically 64 character hex strings
    const accountIdRegex = /^[a-f0-9]{64}$/;
  
    if (principalRegex.test(address)) {
      return "pa";
    } else if (accountIdRegex.test(address)) {
      return "ac";
    } else {
      return "unknown";
    }
  }

export const MY_LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
