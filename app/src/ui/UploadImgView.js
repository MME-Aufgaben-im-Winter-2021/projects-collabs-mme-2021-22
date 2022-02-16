/* eslint-env browser */

import {Event, Observable} from "../utils/Observable.js";

class UploadImgView extends Observable {
    constructor() {
        super();
        this.initViews();
    }

    initViews() {
        this.urlInputElement = document.querySelector(".upload-img .input-field");
        this.urlInputElement.addEventListener("change", this.onURLEntered.bind(this));
        this.uploadImgButton = document.querySelector(".upload-img .upload-img-button");
    }

    onURLEntered(event) {
        console.log("onURLEntered");
    }
}

export default UploadImgView;