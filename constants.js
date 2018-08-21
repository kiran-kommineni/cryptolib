export const APP_SECRET = '3af79c82-c90b-11e7-8cb7-c0cecde8385b';

export const CONTRACT_ADDRESS = '0x99E99194Af1979EcfBa12710293A89c1244eEddb';

const EtherScanHosts = {
    kovan: 'https://kovan.etherscan.io/',
    main: 'https://kovan.etherscan.io/'
};

export const ETHER_SCAN_HOST = EtherScanHosts.kovan;
/**
 * AES 256 Encrypted Keys
 * Key: omshiv
 */
export enum LocalStorageKeys {
    userInfo = 'VebUAvKXVQgcaSth/VP/Yw==',
    userKeys = 'enYYcsQEhwHyNYGi2JecfQ=='
}

export enum ProxyRoutes {
    emailConfirmation = 'email_confirmation'
}

export const REG_EX = {
    password: /^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,15}$/,
    number: /^\d+$/,
    characters: /^[a-zA-Z]+$/
};

