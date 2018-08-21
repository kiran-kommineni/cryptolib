import { LocalStorageKeys } from './constants';
import * as AES from 'crypto-js/aes';
import * as EncUtf8 from 'crypto-js/enc-utf8';
import { UserKeys } from './crypto';

class StorageHelper {
    static _storageHelperInstance;

    constructor() { }

    /**
     * Save Key Value pair in Local Storage
     * @param key LocalStorage Key
     * @param value Value to preserve
     */
    private _save(key: string, value: any) {
        const valueEncryted = AES.encrypt(JSON.stringify(value), 'omshiv');
        // localStorage.setItem(key, JSON.stringify(value));
        localStorage.setItem(key, valueEncryted.toString());
    }

    /**
     * Load Value for key from Local Storage
     * @param key LocalStorage Key
     */
    private _load(key: string) {
        const valueEncrypted = localStorage.getItem(key);
        // console.log('Value Encrypted', valueEncrypted);
        if (!valueEncrypted) {
            return null;
        } else {
            const valueDecryptedBytes = AES.decrypt(valueEncrypted, 'omshiv');
            // console.log('The Value Decrypted', valueDecryptedBytes.toString(EncUtf8));
            return JSON.parse(valueDecryptedBytes.toString(EncUtf8));
        }
        // return JSON.parse(localStorage.getItem(key));
    }

    get userInfo() { return this._load(LocalStorageKeys.userInfo); }
    set userInfo(user: any) { this._save(LocalStorageKeys.userInfo, user); }

    get userKeys(): UserKeys { return this._load(LocalStorageKeys.userKeys); }
    set userKeys(keys: UserKeys) { this._save(LocalStorageKeys.userKeys, keys); }

    clear() {
        localStorage.removeItem(LocalStorageKeys.userInfo);
        localStorage.removeItem(LocalStorageKeys.userKeys);
    }

}

export const storageHelper = new StorageHelper();
