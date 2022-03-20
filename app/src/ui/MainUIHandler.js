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
        this.navBarView.makeInvisible();
        this.siteBody.appendChild(this.navBarView.body);

        // create home screen
        this.homeScreenView = new HomeScreenView();
        this.homeScreenView.body.style.display = "flex";
        this.siteBody.appendChild(this.homeScreenView.body);

        // create NameNewProjectView
        this.nameNewProjectView = new NameNewProjectView();
        this.nameNewProjectView.addEventListener("newProjectNameEntered", this.onNewProjectNameEntered.bind(this));
        this.siteBody.appendChild(this.nameNewProjectView.body);
        this.nameNewProjectView.body.style.display = "none";
    }

    buildUIAfterLogin(displayName) {
        if (displayName === null) {
            // eslint-disable-next-line no-param-reassign
            displayName = CONFIG.ANONYMOUS_USER_NAME;
        }
        this.navBarView.displayUserName(displayName);
        this.navBarView.makeVisible();
        this.siteBody.appendChild(this.navBarView.body);
        this.displayProject(displayName);
        this.displayHomeScreen();
    }

    buildUIAfterLogout() {
        const siteBody = document.querySelector("body");
        this.navBarView.makeInvisible();
        siteBody.removeChild(document.querySelector(".container"));
        // this.canvasView = null;
        this.displayHomeScreen();
    }

    displayProject(displayName) {
        this.container = createElementFromHTML(document.querySelector("#container-template").innerHTML);
        this.screenshotContainerView = new ScreenshotContainerView(this.container);
        this.commentSectionView = new CommentSectionView(this.container, displayName);
        this.commentSectionView.addEventListener("newCommentEntered", this.onNewCommentEntered.bind(this));
        this.uploadImgView = new UploadImgView(this.container);
        this.uploadImgView.addEventListener("newUrlAndNameEntered", this.handleNewUrlAndNameEntered.bind(this));
        this.uploadImgView.addEventListener("deleteFrame", this.deleteFrame.bind(this));
        this.uploadImgView.addEventListener("shareProjectButtonClicked", this.onShareProjectButtonClicked.bind(this));
        this.frameListView = new FrameListView(this.container);
        this.frameListView.addEventListener("frameListElementClicked", this.onFrameListElementClicked.bind(this));
        this.canvasView = new CanvasView(this.container);
        this.container.style.display = "none";
        this.siteBody.appendChild(this.container);
    }

    showProject(project) {
        this.homeScreenView.body.style.display = "none";
        this.container.style.display = "flex";
        this.nameNewProjectView.body.style.display = "none";
        this.frameListView.updateElements(project.frames); // update frame list
        this.screenshotContainerView.exchangeImage(project.getFirstScreenshot()); // show first screenshot
        this.notifyAll(new Event("frameListElementClicked", { id: project.getFirstID() })); // load comments as if first frame was clicked
    }

    displayHomeScreen() {
        this.homeScreenView.body.style.display = "flex";
        this.container.style.display = "none";
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

    changeImage(sourceURL) { this.screenshotContainerView.exchangeImage(sourceURL); }

    updateProjectList(projectArray) { this.navBarView.updateProjectList(projectArray); }

    addComment(text) { this.commentSectionView.addComment(text); }

    showComments(comments) { this.commentSectionView.showComments(comments); }

    showNewComment(commentData) { this.commentSectionView.addComment(commentData.text, commentData.id, commentData.color, commentData.author); }

    // functions notifying index.js

    requestLogin() { this.notifyAll(new Event("requestLogin")); }

    onNewCommentEntered(event) { this.notifyAll(new Event("newCommentEntered", { commentText: event.data.commentText })); }

    handleNewUrlAndNameEntered(event) { this.notifyAll(new Event("makeNewScreenshot", event.data)); }

    performUserLogout() { this.notifyAll(new Event("userLoggedOut")); }

    onShareProjectButtonClicked() { this.notifyAll(new Event("shareProjectButtonClicked")); }

    deleteFrame() { this.notifyAll(new Event("deleteFrame")); }

    onProjectSelected(event) { this.notifyAll(new Event("projectSelected", { id: event.data.id })); }

    onFrameListElementClicked(event) { this.notifyAll(new Event("frameListElementClicked", { id: event.data.id })); }
}

export default MainUIHandler;