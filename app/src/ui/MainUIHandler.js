/* eslint-env browser */

// import { Event, Observable } from "../utils/Observable.js";
import {Event, Observable} from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";
import LoginView from "./LoginView.js";
import ToolBarView from "./ToolBarView.js";
import ScreenshotContainerView from "./ScreenshotContainerView.js";
import CommentSectionView from "./CommentSectionView.js";
import UploadImgView from "./UploadImgView.js";

class MainUIHandler extends Observable {
    constructor() {
        super();
    }

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
        this.toolBarView = new ToolBarView();
        this.toolBarView.addEventListener("projectsToolClicked", this.projectsToolClicked.bind(this));
        this.screenshotContainerView = new ScreenshotContainerView(container);
        this.commentSectionView = new CommentSectionView(container);
        this.commentSectionView.addEventListener("commentEntered", this.handleNewComment.bind(this));
        this.uploadImgView = new UploadImgView(container);
        this.uploadImgView.addEventListener("urlEntered", this.handleUrlEntered.bind(this));
        siteBody.removeChild(document.querySelector(".login"));
        siteBody.appendChild(this.toolBarView.body);
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
}

export default MainUIHandler;