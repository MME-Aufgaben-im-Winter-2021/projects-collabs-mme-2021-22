/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import CONFIG from "../utils/Config.js";
import createElementFromHTML from "../utils/Utilities.js";
import NavBarView from "./navbar/NavBarView.js";
import ScreenshotContainerView from "./websiteScreenshot/ScreenshotContainerView.js";
import CommentSectionView from "./commentSection/CommentSectionView.js";
import UploadImgView from "./websiteScreenshot/UploadImgView.js";
import FrameListView from "./frameList/FrameListView.js";
import CanvasView from "./websiteScreenshot/CanvasView.js";
import HomeScreenView from "./homeScreen/HomeScreenView.js";
import NameNewProjectView from "./homeScreen/NameNewProjectView.js";

class MainUIHandler extends Observable {

    constructor() {
        super();
        this.siteBody = document.querySelector("body");

        // create nav-bar
        this.navBarView = new NavBarView();
        this.navBarView.addEventListener("userLoggedOut", this.performUserLogout.bind(this));
        this.navBarView.addEventListener("projectSelected", this.onProjectSelected.bind(this));
        this.navBarView.addEventListener("homeScreenClicked", this.displayHomeScreen.bind(this));
        this.navBarView.addEventListener("createNewProject", this.displayCreateNewProjectScreen.bind(this));
        this.navBarView.addEventListener("requestLogin", this.requestLogin.bind(this));
        this.navBarView.addEventListener("anonymousUserLoggedOut", this.onAnonymousUserLoggedOut.bind(this));
        this.navBarView.makeInvisible();
        this.siteBody.appendChild(this.navBarView.body);

        // create home screen
        this.homeScreenView = new HomeScreenView();
        this.homeScreenView.addEventListener("projectKeyEntered", this.onProjectKeyEntered.bind(this));
        this.homeScreenView.body.style.display = "flex";
        this.siteBody.appendChild(this.homeScreenView.body);

        // create NameNewProjectView
        this.nameNewProjectView = new NameNewProjectView();
        this.nameNewProjectView.addEventListener("newProjectNameEntered", this.onNewProjectNameEntered.bind(this));
        this.siteBody.appendChild(this.nameNewProjectView.body);
        this.nameNewProjectView.body.style.display = "none";
    }

    buildUIAfterLogin(displayName) {
        this.navBarView.displayUserName(displayName);
        if (displayName !== CONFIG.ANONYMOUS_USER_NAME) {
            this.navBarView.makeVisible();
        }
        this.siteBody.appendChild(this.navBarView.body);
        this.displayProject(displayName);
        this.displayHomeScreen();
    }

    buildUIAfterLogout() {
        const siteBody = document.querySelector("body");
        this.navBarView.makeInvisible();
        siteBody.removeChild(document.querySelector(".container"));
        siteBody.removeChild(this.toolbar);
        // this.canvasView = null;
        this.displayHomeScreen();
    }

    displayProject(displayName) {
        this.container = createElementFromHTML(document.querySelector("#container-template").innerHTML);
        this.screenshotContainerView = new ScreenshotContainerView(this.container);
        this.commentSectionView = new CommentSectionView(this.container, displayName);
        this.commentSectionView.addEventListener("newCommentEntered", this.onNewCommentEntered.bind(this));
        this.commentSectionView.addEventListener("saveCanvas", this.onSaveCanvas.bind(this));
        this.uploadImgView = new UploadImgView(this.container);
        this.uploadImgView.addEventListener("newUrlAndNameEntered", this.handleNewUrlAndNameEntered.bind(this));
        this.uploadImgView.addEventListener("deleteFrame", this.deleteFrame.bind(this));
        this.uploadImgView.addEventListener("shareProjectButtonClicked", this.onShareProjectButtonClicked.bind(this));
        if (displayName === CONFIG.ANONYMOUS_USER_NAME) {
            this.uploadImgView.body.style.display = "none";
        }
        this.canvas = this.container.querySelector("canvas");
        this.frameListView = new FrameListView(this.container);
        this.frameListView.addEventListener("frameListElementClicked", this.onFrameListElementClicked.bind(this));
        this.toolbar = createElementFromHTML(document.querySelector("#toolbar-template").innerHTML);
        this.canvasView = new CanvasView(this.container, this.toolbar);
        this.canvasView.addEventListener("newMarking", this.newMarking.bind(this));
        this.toolbar.style.display = "none";
        this.container.style.display = "none";
        this.siteBody.appendChild(this.container);
        this.siteBody.appendChild(this.toolbar);
    }

    showProject(project) {
        this.context = this.canvas.getContext("2d");
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.homeScreenView.body.style.display = "none";
        this.container.style.display = "flex";
        this.toolbar.style.display = "flex";
        this.nameNewProjectView.body.style.display = "none";
        this.frameListView.updateElements(project.frames); // update frame list
        this.screenshotContainerView.exchangeImage(project.getFirstScreenshot()); // show first screenshot
        this.notifyAll(new Event("frameListElementClicked", { id: project.getFirstID() })); // load comments as if first frame was clicked
    }

    displayHomeScreen() {
        this.homeScreenView.body.style.display = "flex";
        this.container.style.display = "none";
        this.toolbar.style.display = "none";
        this.nameNewProjectView.body.style.display = "none";
    }

    onNewProjectNameEntered(event) {
        this.notifyAll(new Event("newProjectCreated", { newProjectName: event.data.newProjectName }));
    }

    displayCreateNewProjectScreen() {
        this.homeScreenView.body.style.display = "none";
        this.container.style.display = "none";
        this.nameNewProjectView.body.style.display = "flex";
    }

    changeImage(sourceURL) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.screenshotContainerView.exchangeImage(sourceURL);
    }

    updateProjectList(projectArray) { this.navBarView.updateProjectList(projectArray); }

    addComment(text) { this.commentSectionView.addComment(text); }

    showComments(comments) { this.commentSectionView.showComments(comments); }

    showNewComment(commentData) { this.commentSectionView.addComment(commentData.text, commentData.id, commentData.color, commentData.author); }

    showImageOnCanvas(base64Image) {
        this.canvasView.setCanvasImg(base64Image);
    }

    // functions notifying index.js
    onProjectKeyEntered(event) {
        this.notifyAll(new Event("projectKeyEntered", event.data));
    }

    requestLogin() { this.notifyAll(new Event("requestLogin")); }

    onNewCommentEntered(event) { this.notifyAll(new Event("newCommentEntered", { commentText: event.data.commentText, color: event.data.color })); }

    onSaveCanvas(event) { this.notifyAll(new Event("saveCanvas", { canvasPNG: event.data.canvasPNG })); }

    handleNewUrlAndNameEntered(event) { this.notifyAll(new Event("makeNewScreenshot", event.data)); }

    performUserLogout() { this.notifyAll(new Event("userLoggedOut")); }

    onShareProjectButtonClicked() { this.notifyAll(new Event("shareProjectButtonClicked")); }

    deleteFrame() { this.notifyAll(new Event("deleteFrame")); }

    onAnonymousUserLoggedOut() { this.notifyAll(new Event("anonymousUserLoggedOut")); }

    onProjectSelected(event) { this.notifyAll(new Event("projectSelected", { id: event.data.id })); }

    onFrameListElementClicked(event) { this.notifyAll(new Event("frameListElementClicked", { id: event.data.id })); }

    newMarking(event) {
        this.commentSectionView.activateInputField(event);
    }
}

export default MainUIHandler;