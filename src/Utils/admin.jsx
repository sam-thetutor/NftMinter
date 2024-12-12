import { Ed25519KeyIdentity } from '@dfinity/identity';
import { mnemonicToSeedSync } from "bip39";
import { Buffer } from "buffer";

window.Buffer = window.Buffer || Buffer;

const seedPhrase = 'stumble color weird afraid churn badge elephant vanish benefit have crouch verb quote tomorrow fire width tube escape wheel this napkin tennis slot dose';

const mnemonicToId = (mnemonic) => {
    var seed = mnemonicToSeedSync(mnemonic);
    seed = Array.from(seed);
    seed = seed.splice(0, 32);
    seed = new Uint8Array(seed);
    let rr = Ed25519KeyIdentity.generate(seed)
    console.log("admin :",rr.getPrincipal()?.toString())
    return rr ;
}

export const adminIdentity = mnemonicToId(seedPhrase);

//ptudu-wjh4a-vg46w-y6wrc-tqzyz-oabig-h2who-uuoum-43x7b-cqge7-rae