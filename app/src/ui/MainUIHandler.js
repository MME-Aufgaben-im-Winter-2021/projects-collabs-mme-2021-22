/* eslint-env browser */

// import { Event, Observable } from "../utils/Observable.js";
import {Event, Observable} from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";
import LoginView from "./LoginView.js";
import NavBarView from "./NavBarView.js";
import ScreenshotContainerView from "./ScreenshotContainerView.js";
import CommentSectionView from "./CommentSectionView.js";
import UploadImgView from "./UploadImgView.js";
import FrameListView from "./FrameListView.js";
import CanvasView from "./CanvasView.js";


class MainUIHandler extends Observable {
    constructor() {
        super();
        // this.buildUIAfterLogin();
    }

    // commented out the login procedure for easier debugging
    displayLoginWindow() {
        this.loginView = new LoginView();
        const siteBody = document.querySelector("body");
        this.loginView.addEventListener("userLoggedIn", this.onUserLoggedIn.bind(this));
        siteBody.appendChild(this.loginView.body);
    }

    onUserLoggedIn() {
        this.notifyAll(new Event("userLoggedIn"));
    }

    buildUIAfterLogin() {
        const siteBody = document.querySelector("body"),
            container = createElementFromHTML(document.querySelector("#container-template").innerHTML);
        this.navBarView = new NavBarView();
        this.navBarView.addEventListener("projectsToolClicked", this.projectsToolClicked.bind(this));
        this.screenshotContainerView = new ScreenshotContainerView(container);
        this.commentSectionView = new CommentSectionView(container);
        this.commentSectionView.addEventListener("commentEntered", this.handleNewComment.bind(this));
        this.uploadImgView = new UploadImgView(container);
        this.uploadImgView.addEventListener("urlEntered", this.handleUrlEntered.bind(this));
        this.frameListView = new FrameListView(container);
        this.canvasView = new CanvasView(container);
        this.canvasView.canvas.addEventListener("click", this.createVisualLinkToNote.bind(this));
        // siteBody.removeChild(document.querySelector(".login"));
        siteBody.appendChild(this.navBarView.body);
        siteBody.appendChild(container);
    }

    projectsToolClicked() {
        console.log("projects clicked");
    }

    handleNewComment(event) {
        console.log("new comment entered with content: " + event.data.commentText);
        this.addComment(event.data.commentText);
    }

    handleUrlEntered(event) {
        console.log("new URL entered: " + event.data.url);
    }

    addComment(text) {
        this.commentSectionView.addComment(text);
    }

    //creates a rect near the position the user wants to note something
    createVisualLinkToNote(event){
        let context = this.canvasView.context,
         canvas = this.canvasView.canvas,
         bound = canvas.getBoundingClientRect(),
         x = (event.clientX - bound.left) * (canvas.width / bound.width), 
         y = (event.clientY - bound.top) * (canvas.height / bound.height) ;
        context.beginPath();
        context.fillStyle = "blue";
        context.rect(x,y, 5, 5);
        context.stroke();
        context.fill();
    }
}

export default MainUIHandler;