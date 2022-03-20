/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import { checkUrlValid } from "../../utils/Utilities.js";
import FrameListElementView from "../frameList/FrameListElementView.js";

//only important during the session
class UploadImgView extends Observable {
    constructor(container) {
        super();
        this.sessionCounter = 0;
        this.initViews(container);
    }

    initViews(container) {
        this.urlInputElement = container.querySelector(".upload-img .input-url");
        // TODO: save Frame name to Database
        this.frameNameInputElement = container.querySelector(".upload-img .input-frame-name");
        this.uploadImgButton = container.querySelector(".upload-img .upload-img-button");
        this.deleteImgButton = container.querySelector(".upload-img .delete");
        this.shareProjectButton = container.querySelector(".upload-img .share");
        this.urlInputElement.addEventListener("change", this.onURLEntered.bind(this));
        this.frameNameInputElement.addEventListener("change", this.onURLEntered.bind(this));
        this.uploadImgButton.addEventListener("click", this.onURLEntered.bind(this));
        this.deleteImgButton.addEventListener("click", this.onDeleteImgButtonClicked.bind(this));
        this.shareProjectButton.addEventListener("click", this.onShareProjectButtonClicked.bind(this));
    }

    onURLEntered() {
        console.log("onURLEntered");
        this.urlInputElement.value = this.urlInputElement.value.trim();
        this.frameNameInputElement.value = this.frameNameInputElement.value.trim();
        // don't do anything if nothing is entered && must be valid URL
        console.log(checkUrlValid(this.urlInputElement.value));
        if (this.urlInputElement.value !== "" && this.frameNameInputElement.value !== "" && checkUrlValid(this.urlInputElement.value)) {
            this.notifyAll(new Event("newUrlAndNameEntered", { 
                url: this.urlInputElement.value,
                frameName: this.frameNameInputElement.value,
            }));
            this.urlInputElement.value = "";
            this.frameNameInputElement.value = "";
            console.log("valid URL entered");
        }
    }

    //deletes current Picture in canvas
    onDeleteImgButtonClicked() {
        // this.notifyAll(new Event("urlEntered", { url: null }));
        this.notifyAll(new Event("deleteFrame"));
    }

    //saves image to list
    onShareProjectButtonClicked() {
        this.notifyAll(new Event("shareProjectButtonClicked"));
    }

    checkIfCounterHasChanged() {
        let frameList = document.querySelector(".frame-list"),
            items = frameList.getElementsByTagName("li");
        if (items.length !== null && items.length !== this.sessionCounter) {
            this.sessionCounter = items.length;
        }
    }

}

export default UploadImgView;