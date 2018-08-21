import { storageHelper } from './storage';

export namespace Utilities {

    export function isAuthenticated(): boolean {
        const userInfo = storageHelper.userInfo;
        const token = userInfo && userInfo.token;
        if (token) {
            return true;
        } else {
            return false;
        }
    }

    export function downloadObjectAsJson(jsObject: any, filename: string) {
        const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jsObject))}`;
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', `${filename}.json`);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    export function downloadBase64File(dataString: string, filename: string = 'Shivom_Genome') {
        // const dataStr = dataString;
        // const downloadAnchorNode = document.createElement('a');
        // downloadAnchorNode.setAttribute('href', dataStr);
        // downloadAnchorNode.setAttribute('download', `${filename}.txt`);
        // downloadAnchorNode.click();
        // downloadAnchorNode.remove();
        const mimeTypeFiler = dataString.match(/data.*?;base64,/g);
        /**
         * Parse Data String
         */
        dataString = dataString.replace(/data.*?;base64,/g, '');

        const sliceSize  = 512;
        const byteCharacters = atob(dataString);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: mimeTypeFiler && mimeTypeFiler[0] });
        // window.open(URL.createObjectURL(blob), '_blank');
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', URL.createObjectURL(blob));
        downloadAnchorNode.setAttribute('download', `${filename}`);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}
