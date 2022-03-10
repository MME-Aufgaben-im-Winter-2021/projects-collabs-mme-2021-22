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
        this.siteBody = document.querySelector("body");
        this.navBarView = new NavBarView();
        this.navBarView.body.addEventListener("projectsToolClicked", this.projectsToolClicked.bind(this));
        this.navBarView.addEventListener("userLoggedOut", this.performUserLogout.bind(this));
        this.navBarView.addEventListener("displayHomeScreen", this.displayHomeScreen.bind(this));
        this.homeScreenView = new HomeScreenView();
        this.siteBody.appendChild(this.navBarView.body);
        this.siteBody.appendChild(this.homeScreenView.body);
        this.displaySelectedProject();
    }

    projectsToolClicked() {
        console.log("projects clicked");
    }

    // TODO: remove "default"
    displaySelectedProject(projectKey = "default") {
        // TODO: add project resources to UI
        this.homeScreenView.body.style.display = "none";
        this.selectedProject = createElementFromHTML(document.querySelector("#project-template").innerHTML);
        this.screenshotContainerView = new ScreenshotContainerView(this.selectedProject);
        this.commentSectionView = new CommentSectionView(this.selectedProject);
        this.commentSectionView.addEventListener("commentEntered", this.handleNewComment.bind(this));
        this.uploadImgView = new UploadImgView(this.selectedProject);
        this.uploadImgView.addEventListener("urlEntered", this.handleUrlEntered.bind(this));
        this.frameListView = new FrameListView(this.selectedProject);
        this.canvasView = new CanvasView(this.selectedProject);
        this.siteBody.appendChild(this.selectedProject);
    }

    handleNewComment(event) {
        console.log("new comment entered with content: " + event.data.commentText + " isReply: " + event.data.isReply);
        this.addComment(event.data.commentText, event.data.isReply);
        this.notifyAll(new Event("newCommentEntered", { commentText: event.data.commentText }));
    }

    handleUrlEntered(event) {
        console.log("new URL entered: " + event.data.url);
        this.notifyAll(new Event("makeNewScreenshot", { url: event.data.url }));
    }

    displayHomeScreen(event) {
        console.log(event);
        this.displayDefaultHomeScreen();
    }

    addComment(text, isReply) {
        console.log(isReply);
        this.commentSectionView.addComment(text, isReply);
    }

    performUserLogout(event) {
        console.log(event.data);
        this.buildUIAfterLogout();
    }

    buildUIAfterLogin(userName) {
        this.navBarView.toggleUIVisibility(true);
        this.navBarView.userDisplayName.innerText = userName;
    }

    buildUIAfterLogout(event) {
        this.navBarView.toggleUIVisibility(false);
        this.displayDefaultHomeScreen();
    }

    displayDefaultHomeScreen(event) {
        try {
            this.siteBody.removeChild(this.selectedProject);
        } catch (error) {
            console.log(error);
        }
        this.homeScreenView.body.style.display = "flex";

    }

    changeImage(sourceURL) {
        this.screenshotContainerView.exchangeImage(sourceURL);
    }
}

export default MainUIHandler;