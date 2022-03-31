/* eslint-env browser */

import MainUIHandler from "./ui/MainUIHandler.js";
import DatabaseHandler from "./db/DatabaseHandler.js";
import CONFIG from "./utils/Config.js";
import Project from "./models/Project.js";

var isLoggedIn = false,
    currentProject = null,
    currentFrame = {
        id: null,
    };

const databaseHandler = new DatabaseHandler(),
    mainUIHandler = new MainUIHandler();

// console.log(databaseHandler.generateNewKey("projects/-MxeWHB80KhRVicH3W4C/frames"));

databaseHandler.addEventListener("userSignInSuccessful", onUserLoggedIn);
databaseHandler.addEventListener("anonymousUserSignInSuccessful", onAnonymousUserLoggedIn);
databaseHandler.addEventListener("userSignInFailed", onUserLoginFailed);
databaseHandler.addEventListener("userSignOutSuccessful", onUserLogoutSuccessful);
databaseHandler.addEventListener("userSignOutFailed", onUserLogoutFailed);
databaseHandler.addEventListener("projectListReady", onProjectListReady);
databaseHandler.addEventListener("newCommentStored", onNewCommentStored);
databaseHandler.addEventListener("newFrameStored", onNewFrameStored);
databaseHandler.addEventListener("projectLinkedToUser", onProjectSelected);
databaseHandler.addEventListener("canvasLoaded", onCanvasLoaded);
mainUIHandler.addEventListener("userLoggedIn", onUserLoggedIn);
mainUIHandler.addEventListener("requestLogin", onRequestLogin);
mainUIHandler.addEventListener("userLoggedOut", onUserLoggedOut);
mainUIHandler.addEventListener("makeNewScreenshot", makeNewScreenshot);
mainUIHandler.addEventListener("newCommentEntered", onNewCommentEntered);
mainUIHandler.addEventListener("deleteFrame", deleteFrame);
mainUIHandler.addEventListener("projectSelected", onProjectSelected);
mainUIHandler.addEventListener("newProjectCreated", onNewProjectCreated);
mainUIHandler.addEventListener("frameListElementClicked", onFrameListElementClicked);
mainUIHandler.addEventListener("shareProjectButtonClicked", onShareProjectButtonClicked);
mainUIHandler.addEventListener("projectKeyEntered", onProjectKeyEntered);
mainUIHandler.addEventListener("anonymousUserLoggedOut", onUserLoggedOut);
mainUIHandler.addEventListener("saveCanvas", onSaveCanvas);
mainUIHandler.addEventListener("commentUpvoted", handleCommentVote);
mainUIHandler.addEventListener("commentUndoVote", handleCommentVote);
mainUIHandler.addEventListener("commentDownvoted", handleCommentVote);

function init() {
    if (isLoggedIn) {
        onUserLoggedIn();
    }
}

function onRequestLogin() {
    databaseHandler.performSignInWithPopup();
}

function onUserLoggedIn(event) {
    console.log("User logged in");
    isLoggedIn = true;
    mainUIHandler.buildUIAfterLogin(event.data.user.displayName);
    mainUIHandler.updateProjectList(CONFIG.PROJECT_LIST_PLACEHOLDER);
    databaseHandler.getProjectList();
}

function onAnonymousUserLoggedIn(event) {
    console.log("Anonymous User logged in");
    mainUIHandler.buildUIAfterLogin(CONFIG.ANONYMOUS_USER_NAME);
    mainUIHandler.updateProjectList(CONFIG.PROJECT_LIST_PLACEHOLDER);
    databaseHandler.getProjectList();
    onProjectSelected(event);
}

function onUserLoginFailed(event) {
    console.log(event.data);
}

function onUserLoggedOut() {
    databaseHandler.logout();
}

function onUserLogoutSuccessful() {
    isLoggedIn = false;
    mainUIHandler.buildUIAfterLogout();
}

function onUserLogoutFailed(event) {
    console.log(event.data);
}

function makeNewScreenshot(event) {
    getScreenshot(event.data.url, event.data.frameName);
}

// die URL die der Funktion übergeben werden sollte, ist die URL die aus dem Inputfield ausgelesen wird
// Funktion ändert die URL der API auf die entsprechende URL ab
function getApiForUrl(url) {
    const screenshotURL = CONFIG.SCREENSHOT_API.replace("$API_KEY", CONFIG.API_KEY).replace("$URL", url).replace("$WIDTH", CONFIG.SCREENSHOT_WIDTH).replace("$HEIGHT", CONFIG.SCREENSHOT_HEIGHT);
    return screenshotURL;
}

async function getBase64FromUrl(url) {
    // taken from https://stackoverflow.com/a/64929732
    const data = await fetch(url),
        blob = await data.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        };
    });
}

// Funktion ruft die URL der API auf und speichert die Daten im Image
async function getScreenshot(url, frameName) {
    return fetch(getApiForUrl(url))
        .then(response => response.json())
        .then(data => {
            console.log(data.url);
            getBase64FromUrl(data.url)
                .then((base64url) => {
                    console.log("base64url:");
                    console.log(base64url);
                    addScreenshotToDatabase(base64url, frameName);
                });
        });
    // .then(data => screenshot = data);
}

//getScreenshot("https://www.google.de/");

function onNewCommentEntered(event) {
    databaseHandler.storeNewComment(event.data.commentText, currentProject.id, currentFrame.id, event.data.color);
}

function deleteFrame() {
    console.log("deleteFrame");
}

function onProjectListReady(event) {
    mainUIHandler.updateProjectList(event.data);
}

async function onProjectSelected(event) {
    const projectData = await databaseHandler.loadProjectSnapshot(event.data.id);
    currentProject = new Project(projectData.name, event.data.id, projectData.frames);
    mainUIHandler.showProject(currentProject);
}

async function onFrameListElementClicked(event) {
    databaseHandler.getCanvas(currentProject.id, event.data.id);
    mainUIHandler.changeImage(currentProject.getScreenshotByID(event.data.id));
    const comments = await databaseHandler.loadComments(currentProject.id, event.data.id)
        .catch((error) => console.log(error)); // loading comments failed or no comments available
    console.log(comments);
    currentFrame.id = event.data.id;
    // Sort comments by oldest timestamp
    // https://stackoverflow.com/a/7889040
    if (comments !== undefined) { // handle when there are no comments
        comments.sort((a, b) => a.timestamp - b.timestamp);
    }
    mainUIHandler.showComments(comments); // CommentSectionView will be empty if comments === undefined
}

function onNewCommentStored(event) {
    mainUIHandler.showNewComment(event.data);
}

function addScreenshotToDatabase(base64Image, title) {
    databaseHandler.storeNewScreenshot(currentProject.id, base64Image, title, currentProject.name);
}

function onNewFrameStored(event) {
    // TODO: reloading the whole poject after adding a new frame to the database is very data hungry.
    //       should be replaced if necessary and usefull
    console.log(event);
    databaseHandler.getProjectList();
    onProjectSelected(event); // event must contain id in event.data.id
}

function onNewProjectCreated(event) {
    currentProject = new Project(event.data.newProjectName);
    mainUIHandler.showProject(currentProject);
}

function onShareProjectButtonClicked() {
    // copy current Project ID to Clipboard
    // https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    navigator.clipboard.writeText(currentProject.id);
}

function onProjectKeyEntered(event) {
    console.log(databaseHandler.userIsLoggedIn());
    if (!databaseHandler.userIsLoggedIn()) {
        databaseHandler.loginAnonymously(event.data.projectKey);
    } else {
        databaseHandler.linkProject(event.data.projectKey);
    }
}

function onCanvasLoaded(event) {
    mainUIHandler.showImageOnCanvas(event.data.canvasImageBase64);
}

function onSaveCanvas(event) {
    databaseHandler.storeCanvas(currentProject.id, currentFrame.id, event.data.canvasPNG);
}

function handleCommentVote(event) {
    switch (event.type) {
        case "commentUpvoted":
            databaseHandler.setCommentVote(currentProject.id, currentFrame.id, event.data.commentID, CONFIG.UPVOTE_VALUE);
            break;
        case "commentUndoVote":
            databaseHandler.setCommentVote(currentProject.id, currentFrame.id, event.data.commentID, null);
            break;
        case "commentDownvoted":
            databaseHandler.setCommentVote(currentProject.id, currentFrame.id, event.data.commentID, CONFIG.DOWNVOTE_VALUE);
            break;
        default:
            console.log("error handling comment votes");
    }
}

init();

// console.log(await getBase64FromUrl("http://localhost:5500/app/resources/css/test.png"));
