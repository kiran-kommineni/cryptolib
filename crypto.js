import { storageHelper } from './storage';

import * as AES from 'crypto-js/aes';
import * as Sha256 from 'crypto-js/sha256';
import * as EncUtf8 from 'crypto-js/enc-utf8';
import * as JsEncrypt from 'jsencrypt';

console.log('The JS', JsEncrypt);
window['jsEncrypt'] = JsEncrypt;
// declare const JSEncrypt: any;

export UserKeys {
    publicKey: string;
    privateKey: string;
}

export class CryptoHelper {
    var rsa_crypt = "";

    constructor() {
        this.rsa_crypt = new JsEncrypt.JSEncrypt();
    }

    // Initialize the RSA keys
    public setPublicKey(publickey: string): boolean {
        this.rsa_crypt.setPublicKey(publickey);
        return true;
    }

    public setKey(privateKey: string) {
        this.rsa_crypt.setKey(privateKey);
    }

    public getPrivateKey(): string {
        return this.rsa_crypt.getPrivateKey();
    }

    public getPublicKey(): string {
        return this.rsa_crypt.getPublicKey();
    }

    public loadRsaKey(): boolean {
        const user_keys: UserKeys = storageHelper.userKeys;
        const ins_privatekey = user_keys.privateKey;
        if (ins_privatekey) {
            this.rsa_crypt.setPrivateKey(ins_privatekey);
            return true;
        }
        return false;
    }
    // #####################

    // Data Encrypters
    public dataRSAEncrypter(data: any, public_key: string = null) {
        if (public_key) {
            this.setPublicKey(public_key);
            return this.rsa_crypt.encrypt(data);
        }
        if (this.loadRsaKey()) {
            return this.rsa_crypt.encrypt(data);
        }
        return null;
    }

    public dataRSADecrypter(encryptedData: any) {
        if (this.loadRsaKey()) {
            const data: string = this.rsa_crypt.decrypt(encryptedData);
            return data;
        }
        return null;
    }

    public dataAESEncrypter(aeskey: string, document_data: string) {
        return new Promise((resolve, reject) => {
            if (this.loadRsaKey()) {
                setTimeout(() => {
                    try {
                        const encrypted_data = AES.encrypt(document_data, aeskey).toString();
                        resolve(encrypted_data);
                    } catch (err) { reject(err); }
                }, 500);
            } else {
                resolve(null);
            }
        });
    }
    // #####################

    // Data Decrypters
    public dataAESDecrypter(aeskey: string, document_data: string): string {
        if (this.loadRsaKey()) {
            const decrypted_data = AES.decrypt(document_data, aeskey).toString(EncUtf8);
            return decrypted_data;
        }
        return null;
    }
    public fileAesDecrypter(e_aeskey: string, document_file: string): string {
        if (this.loadRsaKey()) {
            const aeskey: string = this.rsa_crypt.decrypt(e_aeskey);
            if (aeskey) {
                const decryptedDoc = AES.decrypt(document_file, aeskey).toString(EncUtf8);
                return decryptedDoc;
            } else {
                return null;
            }
        }
        return null;
    }

    public generateAESKey(length: number): string {
        let allowed_chars = '';
        for (let a = 65, b = 97, digit_idx = 0; a <= 90; a++ , b++ , digit_idx++) {
            allowed_chars += String.fromCharCode(a) + String.fromCharCode(b);
            allowed_chars += (digit_idx <= 9) ? digit_idx : '';
        }

        let key = '';
        while (length > 0) {
            key += allowed_chars[Math.floor(Math.random() * allowed_chars.length)];
            length--;
        }
        return key;
    }

    public checksum(docData: string) {
        return Sha256(docData).toString();
    }
}
