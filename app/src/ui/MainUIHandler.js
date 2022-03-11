/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";
import LoginView from "./LoginView.js";
import NavBarView from "./navbar/NavBarView.js";
import ScreenshotContainerView from "./websiteScreenshot/ScreenshotContainerView.js";
import CommentSectionView from "./commentSection/CommentSectionView.js";
import UploadImgView from "./websiteScreenshot/UploadImgView.js";
import FrameListView from "./frameList/FrameListView.js";
import CanvasView from "./websiteScreenshot/CanvasView.js";
import HomeScreenView from "./homeScreen/HomeScreenView.js";

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

    buildUIAfterLogin(displayName) {
        this.siteBody = document.querySelector("body");
        this.navBarView = new NavBarView(displayName);
        this.navBarView.addEventListener("projectsToolClicked", this.projectsToolClicked.bind(this));
        this.navBarView.addEventListener("userLoggedOut", this.performUserLogout.bind(this));
        this.navBarView.addEventListener("projectSelected", this.onProjectSelected.bind(this));
        this.navBarView.addEventListener("homeScreenClicked", this.displayHomeScreen.bind(this));
        this.siteBody.appendChild(this.navBarView.body);
        this.displayProject(displayName);
        this.displayHomeScreen();
    }

    projectsToolClicked() {
        console.log("projects clicked");
    }

    onNewCommentEntered(event) {
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
        this.frameListView.updateElements(project.frames); // update frame list
        this.screenshotContainerView.exchangeImage(project.getFirstScreenshot()); // show first screenshot
        this.notifyAll(new Event("frameListElementClicked", { id: project.getFirstID() })); // load comments as if first frame was clicked
    }

    updateProjectList(projectArray) {
        this.navBarView.updateProjectList(projectArray);
    }

    onProjectSelected(event) {
        this.displayProject(event.displayName);
        this.notifyAll(new Event("projectSelected", { id: event.data.id }));
    }

    onFrameListElementClicked(event) {
        this.notifyAll(new Event("frameListElementClicked", { id: event.data.id }));
    }

    showComments(comments) {
        this.commentSectionView.showComments(comments);
    }

    showNewComment(commentData) {
        this.commentSectionView.addComment(commentData.text, commentData.id, commentData.color, commentData.author);
    }

    displayProject(displayName) {
        try {
            this.homeScreenView.body.style.display = "none";
        } catch (error) {
            console.log(error);
        }
        this.container = createElementFromHTML(document.querySelector("#container-template").innerHTML);
        this.container.style.display = "flex";
        this.screenshotContainerView = new ScreenshotContainerView(this.container);
        this.commentSectionView = new CommentSectionView(this.container, displayName);
        this.commentSectionView.addEventListener("newCommentEntered", this.onNewCommentEntered.bind(this));
        this.uploadImgView = new UploadImgView(this.container);
        this.uploadImgView.addEventListener("urlEntered", this.handleUrlEntered.bind(this));
        this.uploadImgView.addEventListener("deleteFrame", this.deleteFrame.bind(this));
        this.frameListView = new FrameListView(this.container);
        this.frameListView.addEventListener("frameListElementClicked", this.onFrameListElementClicked.bind(this));
        this.canvasView = new CanvasView(this.container);
        this.siteBody.appendChild(this.container);
    }

    displayHomeScreen(event) {
        this.container.style.display = "none";
        this.homeScreenView = new HomeScreenView();
        this.homeScreenView.body.style.display = "flex";
        this.siteBody.appendChild(this.homeScreenView.body);
    }
}

export default MainUIHandler;