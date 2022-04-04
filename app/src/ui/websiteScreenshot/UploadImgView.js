/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import { checkUrlValid } from "../../utils/Utilities.js";

//only important during the session
class UploadImgView extends Observable {
    constructor(container) {
        super();
        this.sessionCounter = 0;
        this.initViews(container);
    }

    //initiates all elements and listeners
    initViews(container) {
        this.body = container.querySelector(".upload-img");
        this.urlInputElement = container.querySelector(".upload-img .input-url");
        this.frameNameInputElement = container.querySelector(".upload-img .input-frame-name");
        this.uploadImgButton = container.querySelector(".upload-img .upload-img-button");
        this.deleteImgButton = container.querySelector(".upload-img .delete");
        this.shareProjectButton = container.querySelector(".upload-img .share");
        this.urlInputElement.addEventListener("change", this.onURLEntered.bind(this));
        this.frameNameInputElement.addEventListener("change", this.onURLEntered.bind(this));
        this.uploadImgButton.addEventListener("click", this.onURLEntered.bind(this));
        this.deleteImgButton.addEventListener("click", this.onDeleteButtonClicked.bind(this));
        this.shareProjectButton.addEventListener("click", this.onShareProjectButtonClicked.bind(this));
    }

    //notifies listeners if URL is entered to load a img
    onURLEntered() {
        this.urlInputElement.value = this.urlInputElement.value.trim();
        this.frameNameInputElement.value = this.frameNameInputElement.value.trim();
        // don't do anything if nothing is entered && must be valid URL
        if (this.urlInputElement.value !== "" && this.frameNameInputElement.value !== "" && checkUrlValid(this.urlInputElement.value)) {
            this.notifyAll(new Event("newUrlAndNameEntered", {
                url: this.urlInputElement.value,
                frameName: this.frameNameInputElement.value,
            }));
            this.urlInputElement.value = "";
            this.frameNameInputElement.value = "";
        }
    }

    //deletes whole project, can only be done by creator
    onDeleteButtonClicked() {
        this.notifyAll(new Event("deleteProject"));
    }

    //saves image to list
    onShareProjectButtonClicked() {
        this.notifyAll(new Event("shareProjectButtonClicked"));
    }

    //displays project title
    displaySelectedProjectTitle(projectName) {
        this.body.querySelector(".project-name").innerText = projectName;
    }

}

export default UploadImgView;