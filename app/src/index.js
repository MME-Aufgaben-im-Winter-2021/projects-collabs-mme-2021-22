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
databaseHandler.addEventListener("userSignInFailed", onUserLoginFailed);
databaseHandler.addEventListener("userSignOutSuccessful", onUserLogoutSuccessful);
databaseHandler.addEventListener("userSignOutFailed", onUserLogoutFailed);
databaseHandler.addEventListener("projectListReady", onProjectListReady);
databaseHandler.addEventListener("newCommentStored", onNewCommentStored);
databaseHandler.addEventListener("newFrameStored", onNewFrameStored);
mainUIHandler.addEventListener("userLoggedIn", onUserLoggedIn);
mainUIHandler.addEventListener("requestLogin", onRequestLogin);
mainUIHandler.addEventListener("userLoggedOut", onUserLoggedOut);
mainUIHandler.addEventListener("makeNewScreenshot", makeNewScreenshot);
mainUIHandler.addEventListener("newCommentEntered", onNewCommentEntered);
mainUIHandler.addEventListener("deleteFrame", deleteFrame);
mainUIHandler.addEventListener("projectSelected", onProjectSelected);
mainUIHandler.addEventListener("frameListElementClicked", onFrameListElementClicked);
mainUIHandler.addEventListener("frameListElementClicked", onFrameListElementClicked);

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
    // mainUIHandler.showProject(sampleProject);
    mainUIHandler.updateProjectList([{ name: "Foo", id: "-asdasdasd" }, { name: "Bar", id: "-yxcyxcyxcyxc" }]);
    databaseHandler.getProjectList();
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
    getScreenshot(event.data.url);
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
async function getScreenshot(url) {
    return fetch(getApiForUrl(url))
        .then(response => response.json())
        .then(data => {
            console.log(data.url);
            getBase64FromUrl(data.url)
                .then((base64url) => {
                    console.log("base64url:");
                    console.log(base64url);
                    // TODO: implement custom title
                    addScreenshotToDatabase(base64url, "must implement custom title!");
                });
        });
    // .then(data => screenshot = data);
}

//getScreenshot("https://www.google.de/");

function onNewCommentEntered(event) {
    databaseHandler.storeNewComment(event.data.commentText, currentProject.id, currentFrame.id);
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
    databaseHandler.storeNewScreenshot(currentProject.id, base64Image, title);
}

function onNewFrameStored(event) {
    // TODO: reloading the whole poject after adding a new frame to the database is very data hungry.
    //       should be replaced if necessary and usefull
    console.log(event);
    onProjectSelected(event); // event must contain id in event.data.id
}

init();
