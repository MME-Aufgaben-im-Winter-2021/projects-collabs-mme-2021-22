/* eslint-env browser */

import MainUIHandler from "./ui/MainUIHandler.js";
import DatabaseHandler from "./db/DatabaseHandler.js";
import CONFIG from "./utils/Config.js";
import Project from "./models/Project.js"; // model for the currently displayed Project

var currentProject = null, // stores the model of the current project
    currentFrame = {
        id: null, // stores the id of the currently displayed frame. necessary for storing new comments
    };

const databaseHandler = new DatabaseHandler(), // manages all interactions with the database
    mainUIHandler = new MainUIHandler(); // manages all UI related matters

// register all listeners
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
databaseHandler.addEventListener("projectSucessfullyDeleted", onProjectSucessfullyDeleted);
databaseHandler.addEventListener("currentUserCannotDeleteCurrentProject", onCurrentUserCannotDeleteCurrentProject);
mainUIHandler.addEventListener("userLoggedIn", onUserLoggedIn);
mainUIHandler.addEventListener("requestLogin", onRequestLogin);
mainUIHandler.addEventListener("userLoggedOut", onUserLoggedOut);
mainUIHandler.addEventListener("makeNewScreenshot", makeNewScreenshot);
mainUIHandler.addEventListener("newCommentEntered", onNewCommentEntered);
mainUIHandler.addEventListener("deleteProject", deleteProject);
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

// called when the user clicks the login button
function onRequestLogin() {
    databaseHandler.performSignInWithPopup();
}

// called when the login was successful
function onUserLoggedIn(event) {
    mainUIHandler.buildUIAfterLogin(event.data.user.displayName);
    // fill project list with dummy at first until the actual project list is loaded asynchronously
    mainUIHandler.updateProjectList(CONFIG.PROJECT_LIST_PLACEHOLDER);
    // load actual project list
    databaseHandler.getProjectList();
}

// called when no user is logged in and a correct project key was entered. Those users are 
function onAnonymousUserLoggedIn(event) {
    mainUIHandler.buildUIAfterLogin(CONFIG.ANONYMOUS_USER_NAME);
    mainUIHandler.updateProjectList(CONFIG.PROJECT_LIST_PLACEHOLDER);
    databaseHandler.getProjectList();
    onProjectSelected(event);
}

// called when logging in failed
function onUserLoginFailed(event) {
    console.error(event.data);
}

// called when the user clicks the logout button
function onUserLoggedOut() {
    databaseHandler.logout();
}

// called when logout was successful
function onUserLogoutSuccessful() {
    mainUIHandler.buildUIAfterLogout(); // reset UI
}

// called when logging out failed
function onUserLogoutFailed(event) {
    console.error(event.data);
}

// called when upload button is clicked to create a new screenshot
function makeNewScreenshot(event) {
    getScreenshot(event.data.url, event.data.frameName);
}

// die URL die der Funktion übergeben werden sollte, ist die URL die aus dem Inputfield ausgelesen wird
// Funktion ändert die URL der API auf die entsprechende URL ab
function getApiForUrl(url) {
    const screenshotURL = CONFIG.SCREENSHOT_API.replace("$API_KEY", CONFIG.API_KEY).replace("$URL", url).replace("$WIDTH", CONFIG.SCREENSHOT_WIDTH).replace("$HEIGHT", CONFIG.SCREENSHOT_HEIGHT);
    return screenshotURL;
}

// Turns picture from url into a base 64 string
// taken from https://stackoverflow.com/a/64929732
async function getBase64FromUrl(url) {
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
            getBase64FromUrl(data.url)
                .then((base64url) => {
                    addScreenshotToDatabase(base64url, frameName);
                });
        });
}

// called when the user enters a new comment
function onNewCommentEntered(event) {
    databaseHandler.storeNewComment(event.data.commentText, currentProject.id, currentFrame.id, event.data.color);
}

// called when the user wants to delete the current project
function deleteProject() {
    if (currentFrame.id !== null) { // not yet created projects cannot be deleted
        databaseHandler.deleteProject(currentProject.id);
    }
}

// called when a project is deleted sucessfully
function onProjectSucessfullyDeleted() {
    currentProject = null;
    mainUIHandler.displayHomeScreen();
    databaseHandler.getProjectList();
    mainUIHandler.notifyProjectDeleted();
}

// Called when the currently logged in user is not allowed to delete the current project
function onCurrentUserCannotDeleteCurrentProject() {
    // inform user that he is not allowed to delete the current project
    mainUIHandler.notifyDeleteNotPossible();
}

// called when the list of project the user is allowed to access is ready
function onProjectListReady(event) {
    mainUIHandler.updateProjectList(event.data); // display project list
}

// Called when a project in the project list is selected. Handles fetching and then displaying the project's content.
async function onProjectSelected(event) {
    let projectData;
    try {
        projectData = await databaseHandler.loadProjectSnapshot(event.data.id);
    } catch (error) {
        console.log(error);
        mainUIHandler.notifyProjectNotFound(); // show error feedback to the user
        databaseHandler.logout(); // make sure no user is logged in
        return; // function can end here
    }
    // display project in UI
    currentProject = new Project(projectData.name, event.data.id, projectData.frames);
    mainUIHandler.showProject(currentProject);
}

// Called when the user cicks on a frame in the frame list.
async function onFrameListElementClicked(event) {
    databaseHandler.getCanvas(currentProject.id, event.data.id); // load and display new canvas content
    mainUIHandler.changeImage(currentProject.getScreenshotByID(event.data.id)); // switch displayed image
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

// called when storing a new comment was successful
function onNewCommentStored(event) {
    mainUIHandler.showNewComment(event.data); // show new comment
}

// Called when creating a new screenshot was successful.
// The new screenshot will be stored in the database together with its title.
function addScreenshotToDatabase(base64Image, title) {
    databaseHandler.storeNewScreenshot(currentProject.id, base64Image, title, currentProject.name);
}

// Called when a new Screenshot is successfully stored in the database.
function onNewFrameStored(event) {
    // reloading the whole poject after adding a new frame to the database is very data hungry.
    // should be replaced if necessary and useful
    databaseHandler.getProjectList(); // reload project list, so when a new Project is created it is instantly shown.
    onProjectSelected(event); // event must contain id in event.data.id
}

// shows new empty project
function onNewProjectCreated(event) {
    currentProject = new Project(event.data.newProjectName);
    mainUIHandler.showProject(currentProject);
}

// called when the share button is clicked
function onShareProjectButtonClicked() {
    // copy current Project ID to Clipboard
    // https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    navigator.clipboard.writeText(currentProject.id);
}

// called when a project key is entered
function onProjectKeyEntered(event) {
    if (!databaseHandler.userIsLoggedIn()) { // login anonymous user when n
        databaseHandler.loginAnonymously(event.data.projectKey);
    } else {
        databaseHandler.linkProject(event.data.projectKey);
    }
}

// Called when the canvas content was successfully loaded from database.
function onCanvasLoaded(event) {
    mainUIHandler.showImageOnCanvas(event.data.canvasImageBase64);
}

// Called to save Canvas when a new Comment was entered together with a marking.
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