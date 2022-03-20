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
        // don't do anything if nothing is entered && must be valid URL
        console.log(checkUrlValid(this.urlInputElement.value.trim()));
        if (this.urlInputElement.value !== "" && checkUrlValid(this.urlInputElement.value.trim())) {
            this.notifyAll(new Event("urlEntered", { url: this.urlInputElement.value.trim() }));
            this.urlInputElement.value = null;
            console.log("valid URL entered");
        }
    }

    //deletes current Picture in canvas
    onDeleteImgButtonClicked() {
        // this.notifyAll(new Event("urlEntered", { url: null }));
        this.notifyAll(new Event("deleteFrame"));
    }

    //saves image to list
    onSaveImgButtonClicked() {
        this.addScreenshotToList();
    }

    //creates an element of the given picture
    addScreenshotToList() {
        this.checkIfCounterHasChanged();
        let picture = document.querySelector(".screenshot"),
            frameList = document.querySelector(".frame-list");
        const frameListElement = new FrameListElementView(this.sessionCounter, this.sessionCounter, picture.src);
        this.sessionCounter++;
        frameList.appendChild(frameListElement.body);
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