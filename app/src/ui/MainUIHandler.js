/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
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

    buildUIAfterLogin(displayName) {
        const siteBody = document.querySelector("body"),
            container = createElementFromHTML(document.querySelector("#container-template").innerHTML);
        this.navBarView = new NavBarView(displayName);
        this.navBarView.addEventListener("projectsToolClicked", this.projectsToolClicked.bind(this));
        this.navBarView.addEventListener("userLoggedOut", this.performUserLogout.bind(this));
        this.navBarView.addEventListener("projectSelected", this.onProjectSelected.bind(this));
        this.screenshotContainerView = new ScreenshotContainerView(container);
        this.commentSectionView = new CommentSectionView(container);
        this.commentSectionView.addEventListener("commentEntered", this.handleNewComment.bind(this));
        this.uploadImgView = new UploadImgView(container);
        this.uploadImgView.addEventListener("urlEntered", this.handleUrlEntered.bind(this));
        this.uploadImgView.addEventListener("deleteFrame", this.deleteFrame.bind(this));
        this.frameListView = new FrameListView(container);
        this.frameListView.addEventListener("frameListElementClicked", this.onFrameListElementClicked.bind(this));
        this.canvasView = new CanvasView(container);
        if(document.querySelector(".login")){
            siteBody.removeChild(document.querySelector(".login"));}
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

    deleteFrame() {
        this.notifyAll(new Event("deleteFrame"));
    }

    showProject(project) {
        this.screenshotContainerView.exchangeImage(project.getFirstScreenshot());
        this.frameListView.updateElements(project.frames);
    }

    updateProjectList(projectArray) {
        this.navBarView.updateProjectList(projectArray);
    }

    onProjectSelected(event) {
        this.notifyAll(new Event("projectSelected", { id: event.data.id }));
    }

    onFrameListElementClicked(event) {
        this.notifyAll(new Event("frameListElementClicked", { id: event.data.id }));
    }
}

export default MainUIHandler;