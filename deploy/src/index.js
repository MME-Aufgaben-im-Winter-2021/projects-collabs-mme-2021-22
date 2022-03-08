/* eslint-env browser */

import MainUIHandler from "./ui/MainUIHandler.js";
import DatabaseHandler from "./db/DatabaseHandler.js";
import CONFIG from "./utils/config.js";

var isLoggedIn = false;

const databaseHandler = new DatabaseHandler(),
    mainUIHandler = new MainUIHandler();

databaseHandler.addEventListener("userSignInSuccessful", onUserLoggedIn);
//databaseHandler.addEventListener("userSignInFailed", onUserLoginFailed);
databaseHandler.addEventListener("userSignOutSuccessful", onUserLogoutSuccessful);
//databaseHandler.addEventListener("userSignOutFailed", onUserLogoutFailed);
mainUIHandler.addEventListener("userLoggedIn", onUserLoggedIn);
mainUIHandler.addEventListener("userLoggedOut", onUserLoggedOut);
mainUIHandler.addEventListener("makeNewScreenshot", makeNewScreenshot);
mainUIHandler.addEventListener("newCommentEntered", saveNewComment);

function init() {
    //console.log("### Starting MME Project ###");
    if (!isLoggedIn) {
        mainUIHandler.displayLoginWindow();
    } else {
        onUserLoggedIn();
    }
}

function onUserLoggedIn(event) {
    //console.log("User logged in");
    //console.log(event.data.user.displayName);
    isLoggedIn = true;
    mainUIHandler.buildUIAfterLogin(event.data.user.displayName);
}

/*function onUserLoginFailed(event) {
    console.log(event.data);
}*/

function onUserLoggedOut() {
    databaseHandler.logout();
}

function onUserLogoutSuccessful() {
    isLoggedIn = false;
    mainUIHandler.buildUIAfterLogout();
}

/*function onUserLogoutFailed(event) {
    console.log(event.data);
}*/

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
            //console.log(data.url);
            getBase64FromUrl(data.url)
                .then((base64url) => {
                    //console.log("base64url:");
                    //console.log(base64url);
                    mainUIHandler.changeImage(base64url);
                });
        });
    // .then(data => screenshot = data);
}

//getScreenshot("https://www.google.de/");

function saveNewComment(event) {
    databaseHandler.storeNewComment(event.data.commentText);
}