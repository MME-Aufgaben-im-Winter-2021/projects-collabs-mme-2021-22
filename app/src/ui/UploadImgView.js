/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";

class UploadImgView extends Observable {
    constructor(container) {
        super();
        this.initViews(container);
    }

    initViews(container) {
        this.urlInputElement = container.querySelector(".upload-img .input-url");
        this.uploadImgButton = container.querySelector(".upload-img .upload-img-button");
        this.deleteImgButton = container.querySelector(".upload-img .delete");
        this.saveImgButton = container.querySelector(".upload-img .save");
        this.urlInputElement.addEventListener("change", this.onURLEntered.bind(this));
        this.uploadImgButton.addEventListener("click", this.onURLEntered.bind(this));
        this.deleteImgButton.addEventListener("click", this.onDeleteImgButtonClicked.bind(this));
        this.saveImgButton.addEventListener("click", this.onSaveImgButtonClicked.bind(this));
    }

    onURLEntered() {
        console.log("onURLEntered");
        if (this.urlInputElement.value !== "") { // don't do anything if nothing is entered
            this.notifyAll(new Event("urlEntered", { url: this.urlInputElement.value }));
            this.urlInputElement.value = "";
        }
    }

    onDeleteImgButtonClicked() {
        console.log("onDeleteImgButtonClicked");
    }
    
    onSaveImgButtonClicked() {
        console.log("onSaveImgButtonClicked");

    }
}

export default UploadImgView;