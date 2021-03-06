/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";
class FrameListElementView extends Observable {
    constructor(id, title = "description here", base64Image = "./resources/css/test.png") {
        super();
        this.id = id;
        this.title = title;
        this.body = createElementFromHTML(document.getElementById("frame-list-item-template").innerHTML);
        this.frameList = document.querySelector(".frame-list");
        this.liCount = this.frameList.querySelectorAll("li").length;
        this.body.querySelector(".frame-description").innerHTML = this.title;
        this.description = this.body.querySelector(".frame-description");
        this.imageElement = this.body.querySelector("img.frame-img");
        this.imageElement.src = base64Image;
        this.imageElement.addEventListener("click", this.onImageClicked.bind(this));
    }

    //notifies if click on frame image
    onImageClicked() {
        this.notifyAll(new Event("frameListElementClicked", { id: this.id }));
    }
}

export default FrameListElementView;