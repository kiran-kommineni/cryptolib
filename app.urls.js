import { storageHelper } from './storage';

class ApplicationUrls {
    private static appUrlsInstance: ApplicationUrls;
    public serverUrl: string;

    public static getInstance(): ApplicationUrls {
        if (!ApplicationUrls.appUrlsInstance) {
            ApplicationUrls.appUrlsInstance = new ApplicationUrls();
            /**
             * Server Url for REST API
             */
            ApplicationUrls.appUrlsInstance.serverUrl = 'https://backendalpha.shivom.io/';
        }
        return ApplicationUrls.appUrlsInstance;
    }

    public headers() {
        const userInfo = storageHelper.userInfo;
        const headers = {
            Authorization: userInfo.tokenType + ' ' + userInfo.token
        };

        return new HttpHeaders(headers);
    }

    // ACCOUNT URLS
    get SIGNUP_URL() { return this.serverUrl + 'accounts/signup/'; }
    get LOGIN_URL() { return this.serverUrl + 'accounts/login/'; }
    get EMAIL_CONFIRM_URL() { return this.serverUrl + 'accounts/email_confirmation/'; }

    get USER_PROFILE_DATA_URL() { return this.serverUrl + 'data/profile_data/'; }
    get HEALTH_DATA_URL() { return this.serverUrl + 'data/health_data/'; }

    get PUBLIC_KEY_URL() { return this.serverUrl + 'accounts/public_key/'; }

    get SIGNATURE_URL() { return this.serverUrl + 'accounts/attach_eth_address/'; }

    get ETH_ADDRESS_URL() { return this.serverUrl + 'accounts/get_eth_address/'; }

    get GENOME_DATA_URL() { return this.serverUrl + 'data/genome_data/'; }

    get DELETE_DATA_URL() { return this.serverUrl + 'data/delete_data/'; }

}

export let applicationUrls = ApplicationUrls.getInstance();
