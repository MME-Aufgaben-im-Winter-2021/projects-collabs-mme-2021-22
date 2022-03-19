/* eslint-env browser */

/*
This will provide a different view of a project.
The view a user sees AFTER uploading his project - the evaluation view where different users can comment and help
*/

import { Observable } from "../utils/Observable.js";
import FrameListElementView from "./FrameListElementView.js";
import Comment from "./Comment.js";

var bodyHTML = document.querySelector("body"),
    imageListHTML = document.querySelector("body > div.container.border > div.screenshot-container > ul"),
    editingBarHTML = document.querySelector("body > div.container.border > div.upload-img"),
    shownImage = document.querySelector("body > div.container.border > div.screenshot-container > img"),
    commitButton = document.querySelector("body > div.container.border > div.upload-img > span.round-button.commit"),
    commentListSection = document.querySelector("body > div.container.border > div.comment-section > ul.comment-section"),
    canvas = document.querySelector("body > div.container.border > div.screenshot-container > div > canvas");

class ProjectView extends Observable {

    constructor(id) {
        super();
        this.id = id;
        this.imgList = [];
        this.commentList = [];
        this.canvasURL = "";
        commitButton.addEventListener("click", this.uploadProjectToFirebase().bind(this));
    }

    //uploading
    //adds Images to List after creating the project
    addImagesToList() {
        for (let i = 0; i < imageListHTML.length; i++) {
            this.imgList.push(imageListHTML[i].src);
        }
    }

    //uploading
    //takes href of canvas
    canvasToUrl() {
        let dataUrl = canvas.toDataURL();
        this.canvasURL = dataUrl;
    }

    //downloading
    //deletes everything only necessary for editing and also existing images from the overview-list
    deleteBody() {
        let list = imageListHTML;
        while (list.firstChild) {
            list.removeChild(list.lastChild);
        }
        bodyHTML.removeChild(editingBarHTML);
    }

    //downloading
    //sets up all the images if project is opened
    setupImages() {
        shownImage.src = this.imgList[0];
        for (let i = 0; i < this.imgList.length; i++) {
            let frameListElement = new FrameListElementView(i, i, this.imgList[i]);
            imageListHTML.appendChild(frameListElement.body);
        }
    }

    //downloading
    //adds existing comments to comment section
    addComments() {
        for (let i = 0; i < this.commentList.length; i++) {
            let comment = new Comment(this.commentList[i]);
            commentListSection.appendChild(comment);
        }
    }

    //uploading
    saveNewComments() {
        this.commentList = null;
        this.commentList = commentListSection.getElementsByClassName("text-field");
    }

    //downloading
    //uses URL of old Canvas to add a img to the new one
    setupCanvas() {
        let image = new Image();
        var ctx = canvas.getContext("2d");
        image.onload = function () {
            ctx.drawImage(image, 0, 0);
        };
        image.src = this.canvasURL;
    }

    //uploads images to firebase, comments dont exist yet
    uploadProjectToFirebase() {
        this.addImagesToList();
        this.canvasToUrl();
        this.saveNewComments();

        //TODO: use hrefs saved in imageList and canvasURL now to upload the project to db
    }
}

export default { ProjectView };