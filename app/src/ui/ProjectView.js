/* eslint-env browser */

/*This will provide a different view of a project.
The view a user sees AFTER uploading his project - the evaluation view where different user can commend and help*/


/*import { Observable } from "../utils/Observable.js";
import FrameListElementView from "./FrameListElementView.js";

var projectList = [],
    bodyHTML = document.querySelector("body"),
    imageListHTML = document.querySelector("body > div.container.border > div.screenshot-container > ul"),
    editingBarHTML = document.querySelector("body > div.container.border > div.upload-img"),
    shownImage = document.querySelector("body > div.container.border > div.screenshot-container > img"),
    uploadButton = document.querySelector("body > div.container.border > div.upload-img > img");

class ProjectView extends Observable {

    constructor(id) {
        super();
        this.id = id;
        this.imgList = [];
        this.commentList = [];
        uploadButton.addEventListener("click", this.addImagesToList().bind(this));
    }

    //adds Images to List after creating the project
    addImagesToList() {
        for (let i = 0; i < imageListHTML.length; i++) {
            this.imgList.push(imageListHTML[i].src);
        }
    }

    //deletes everything only necessary for editing and also existing images from the overview-list
    deleteBody() {
        let list = imageListHTML;
        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }
        bodyHTML.removeChild(editingBarHTML);
    }

    //sets up all the images if project is opened
    setupImages() {
        shownImage.src = this.imgList[0];
        for (let i = 0; i < this.imgList.length; i++) {
            let frameListElement = new FrameListElementView(i, i, this.imgList[i]);
            imageListHTML.appendChild(frameListElement.body);
        }
    }

    /* TODO: - addComment function
             - initialize all saved comments of the project
             - implementation of corresponding necessary Views
    */
// }

// export default { ProjectView };

// WIP