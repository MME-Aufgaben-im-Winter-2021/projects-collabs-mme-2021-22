/* eslint-env browser */

import Model from "./Model.js";
import ToolsView from "./ui/ToolsView.js";
import ScreenshotContainerView from "./ui/ScreenshotContainerView.js";
import UploadImgView from "./ui/UploadImgView.js";
import LoginView from "./ui/LoginView.js";
import MainUIHandler from "./ui/MainUIHandler.js";
import CommentSectionView from "./ui/CommentSectionView.js";
import CONFIG from "./utils/config.js";
import createElementFromHTML from "./utils/Utilities.js";

var isLoggedIn = false;

const model = new Model(), // example, could be e.g. Database Handler
    mainUIHandler = new MainUIHandler();

function init() {
    mainUIHandler.addEventListener("userLoggedIn", onUserLoggedIn);
    console.log("### Starting MME Project ###");
    if (!isLoggedIn) {
        mainUIHandler.displayLoginWindow();
    } else {
        onUserLoggedIn();
    }
    // toolsView.addEventListener("toolAddButtonClicked", onToolAddButtonClicked);
    // addExampleComment();
}

function onUserLoggedIn() {
    console.log("User logged in");
    isLoggedIn = true;
    mainUIHandler.buildUIAfterLogin();
}

init();