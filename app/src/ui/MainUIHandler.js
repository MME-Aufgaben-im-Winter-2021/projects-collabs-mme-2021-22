/* eslint-env browser */

// import { Event, Observable } from "../utils/Observable.js";
import {Event, Observable} from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";
import LoginView from "./Login/LoginView.js";
import NavBarView from "./NavBar/NavBarView.js";
import ScreenshotContainerView from "./ScreenshotManagement/ScreenshotContainerView.js";
import CommentSectionView from "./Comments/CommentSectionView.js";
import UploadImgView from "./ScreenshotManagement/UploadImgView.js";
import FrameListView from "./FrameList/FrameListView.js";
import CanvasView from "./ScreenshotManagement/CanvasView.js";

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
        this.navBarView.addEventListener("userLoggedOut", this.performUserLogout.bind(this));
        this.screenshotContainerView = new ScreenshotContainerView(container);
        this.commentSectionView = new CommentSectionView(container);
        this.commentSectionView.addEventListener("commentEntered", this.handleNewComment.bind(this));
        this.uploadImgView = new UploadImgView(container);
        this.uploadImgView.addEventListener("urlEntered", this.handleUrlEntered.bind(this));
        this.frameListView = new FrameListView(container);
        this.canvasView = new CanvasView(container);
        siteBody.removeChild(document.querySelector(".login"));
        siteBody.appendChild(this.navBarView.body);
        siteBody.appendChild(container);
    }

    projectsToolClicked() {
        console.log("projects clicked");
    }

    handleNewComment(event) {
        console.log("new comment entered with content: " + event.data.commentText);
        this.addComment(event.data.commentText);
        this.notifyAll(new Event("newCommentEntered", { commentText: event.data.commentText }));
    }

    handleUrlEntered(event) {
        console.log("new URL entered: " + event.data.url);
        this.notifyAll(new Event("makeNewScreenshot", { url: event.data.url }));
    }

    addComment(text) {
        this.commentSectionView.addComment(text);
    }

    performUserLogout() {
        this.notifyAll(new Event("userLoggedOut"));
    }

    buildUIAfterLogout() {
        const siteBody = document.querySelector("body");
        siteBody.removeChild(document.querySelector(".navbar"));
        siteBody.removeChild(document.querySelector(".container"));
        this.displayLoginWindow();
    }

    changeImage(sourceURL) {
        this.screenshotContainerView.exchangeImage(sourceURL);
    }
}

export default MainUIHandler;