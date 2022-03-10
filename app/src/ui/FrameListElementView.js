/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";
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
        this.deleteButton = this.body.querySelector(".delete-button");
        this.deleteButton.addEventListener("click", this.onDeleteButtonClicked.bind(this));
        this.imageElement = this.body.querySelector("img.frame-img");
        this.imageElement.src = base64Image;
        this.imageElement.addEventListener("click", this.onImageClicked.bind(this));
    }

    onImageClicked() {
        this.notifyAll(new Event("frameListElementClicked", {id: this.id}));
    }

    //simply deletes the html body of this, removing the frame off the list
    onDeleteButtonClicked(){
        this.frameList.removeChild(this.body);
        this.refractureList();
    }

    //sets list items description new, according to their old one
    refractureList(){
        let j = 0,
            items = this.frameList.getElementsByTagName("li");
        for(let i = 0; i < items.length; i++){
            items[i].querySelector(".frame-description").innerHTML = j;
            j++;
        }
    }
}

export default FrameListElementView;