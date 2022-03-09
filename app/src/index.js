/* eslint-env browser */

import MainUIHandler from "./ui/MainUIHandler.js";
import DatabaseHandler from "./db/DatabaseHandler.js";
import CONFIG from "./utils/Config.js";
import Project from "./models/Project.js";

var isLoggedIn = false,
    currentProject = null;

const databaseHandler = new DatabaseHandler(),
    mainUIHandler = new MainUIHandler();

// console.log(databaseHandler.generateNewKey("projects/-MxeWHB80KhRVicH3W4C/frames"));

databaseHandler.addEventListener("userSignInSuccessful", onUserLoggedIn);
databaseHandler.addEventListener("userSignInFailed", onUserLoginFailed);
databaseHandler.addEventListener("userSignOutSuccessful", onUserLogoutSuccessful);
databaseHandler.addEventListener("userSignOutFailed", onUserLogoutFailed);
databaseHandler.addEventListener("projectListReady", onProjectListReady);
mainUIHandler.addEventListener("userLoggedIn", onUserLoggedIn);
mainUIHandler.addEventListener("userLoggedOut", onUserLoggedOut);
mainUIHandler.addEventListener("makeNewScreenshot", makeNewScreenshot);
mainUIHandler.addEventListener("newCommentEntered", saveNewComment);
mainUIHandler.addEventListener("deleteFrame", deleteFrame);
mainUIHandler.addEventListener("projectSelected", onProjectSelected);
mainUIHandler.addEventListener("frameListElementClicked", onFrameListElementClicked);

function init() {
    console.log("### Starting MME Project ###");
    if (!isLoggedIn) {
        mainUIHandler.displayLoginWindow();
    } else {
        onUserLoggedIn();
    }
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

init();

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
                    mainUIHandler.changeImage(base64url);
                });
        });
    // .then(data => screenshot = data);
}

//getScreenshot("https://www.google.de/");

function saveNewComment(event) {
    databaseHandler.storeNewComment(event.data.commentText);
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
    // Sort comments by newest timestamp
    // https://stackoverflow.com/a/7889040
    comments.sort((a, b) => b.timestamp - a.timestamp);
    mainUIHandler.showComments(comments);
}
