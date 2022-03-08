/* eslint-env browser */

import {Event, Observable} from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";
import NavBarView from "./NavBarView.js";
import ScreenshotContainerView from "./ScreenshotContainerView.js";
import CommentSectionView from "./CommentSectionView.js";
import UploadImgView from "./UploadImgView.js";
import FrameListView from "./FrameListView.js";
import CanvasView from "./CanvasView.js";
import HomeScreenView from "./HomeScreenView.js";

class MainUIHandler extends Observable {
    constructor() {
        super();
        this.buildUI();
    }

    buildUI() {
        const siteBody = document.querySelector("body"),
            container = createElementFromHTML(document.querySelector("#project-template").innerHTML);
        this.navBarView = new NavBarView();
        this.navBarView.addEventListener("projectsToolClicked", this.projectsToolClicked.bind(this));
        this.navBarView.addEventListener("userLoggedOut", this.performUserLogout.bind(this));
        this.homeScreenView = new HomeScreenView();

        // this.screenshotContainerView = new ScreenshotContainerView(container);
        // this.commentSectionView = new CommentSectionView(container);
        // this.commentSectionView.addEventListener("commentEntered", this.handleNewComment.bind(this));
        // this.uploadImgView = new UploadImgView(container);
        // this.uploadImgView.addEventListener("urlEntered", this.handleUrlEntered.bind(this));
        // this.frameListView = new FrameListView(container);
        // this.canvasView = new CanvasView(container);

        siteBody.appendChild(this.navBarView.body);
        siteBody.appendChild(this.homeScreenView.body);
        // siteBody.appendChild(container);
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