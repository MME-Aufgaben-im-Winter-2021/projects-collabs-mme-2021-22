/* eslint-env browser */

import { Observable } from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";

class FrameListElementView extends Observable {
    constructor(id, title = "description here", base64Image = "./resources/css/test.png") {
        super();
        this.id = id;
        this.title = title;
        this.body = createElementFromHTML(document.getElementById("frame-list-item-template").innerHTML);
        this.body.querySelector(".frame-description").innerHTML = this.title;
        this.imageElement = this.body.querySelector("img.frame-img");
        this.imageElement.src = base64Image;
        this.imageElement.addEventListener("click", this.onImageClicked.bind(this));
    }

    onImageClicked() {
        console.log("onImageClicked");
    }
}

export default FrameListElementView;