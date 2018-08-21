import { CONTRACT_ADDRESS } from './constants';

declare var web3;
declare var require;

const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');


const PocAbi = require('../../assets/abi/pocAbi.json');

type EthAddress = string;
type EthTxHex = string;

export class MetamaskHelper {

    public onAccountChange: () => any;

    constructor() { }

    get provider() {
        // return web3.currentProvider;
        return web3.currentProvider;
    }

    get isAvailable() {
        if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask) {
            return true;
        } else {
            return false;
        }
    }

    get defaultAccount(): EthAddress {
        return web3.eth.defaultAccount;
    }

    getBalance(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            web3.eth.getBalance(this.defaultAccount, (err, balance) => {
                if (err !== null) {
                    reject(err);
                } else {
                    const _balance = balance.dividedBy(10 ** 18).toNumber();
                    resolve(_balance);
                }
            });
        });
    }

    isUnlocked(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            web3.eth.getAccounts((err, accounts) => {
                if (err !== null) {
                    reject(err);
                } else if (accounts.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    signData(data: string, address: string) {
        return new Promise<string>((resolve, reject) => {
            const method = 'personal_sign';
            const params = [web3.toHex(data), address];
            web3.currentProvider.sendAsync({
                method,
                params,
                address
            }, (err, result) => {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    transact(transaction, callback?: Function) {
        // return web3.eth.sendTransaction(transaction);
        return new Promise((resolve, reject) => {
            web3.eth.sendTransaction(transaction, (err, response) => {
                console.log('The Metamask Transaction', transaction);
                if (err !== null) {
                    reject(err);
                } else {
                    if (callback) {
                        callback(err, response);
                    }
                    resolve(null);
                }
            });
        });
    }

    checkMainNetwork() {
        return new Promise((resolve, reject) => {
            web3.version.getNetwork((err, netId) => {
                if (err !== null) {
                    reject(err);
                } else if (netId === '1') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    regesterPublicKey(key: string): Promise<EthTxHex> {
        const eth = new Eth(this.provider);
        const contract = new EthContract(eth);
        const pocContract = contract(PocAbi).at(CONTRACT_ADDRESS);
        return pocContract.register(key, {
            from: this.defaultAccount,
            value: '0x00'
        });
    }

    registerUpload(uploadType: string, version: string, userKey: string, checksum: string) {
        const eth = new Eth(this.provider);
        const contract = new EthContract(eth);
        const pocContract = contract(PocAbi).at(CONTRACT_ADDRESS);
        return pocContract.uploadData(uploadType, version, userKey, checksum, {
            from: this.defaultAccount,
            value: '0x00'
        });
    }

    async waitForTransaction(txHash: EthTxHex) {
        const getTransactionReceipt = () => {
            return new Promise((res, rej) => {
                web3.eth.getTransactionReceipt(txHash, (err, result) => {
                    if (err !== null) {
                        rej(err);
                    }
                    res(result);
                });
            });
        };

        let txReceipt;
        while (!txReceipt) {
            txReceipt = await getTransactionReceipt();
            console.log('The Transaction Receipt', txReceipt);
        }
        console.log('The Transaction Receipt', txReceipt);
        return txReceipt;
    }

    toChecksumAddress(address: EthAddress): EthAddress {
        return web3.toChecksumAddress(address);
    }

    disconnect() {

    }

}
