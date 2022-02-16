/* eslint-env browser */

import Model from "./Model.js";
import ToolsView from "./ui/ToolsView.js";
import ScreenshotContainerView from "./ui/ScreenshotContainerView.js";
import UploadImgView from "./ui/UploadImgView.js";
import CommentSectionView from "./ui/CommentSectionView.js";

const model = new Model(),
    toolsView = new ToolsView(),
    screenshotContainerView = new ScreenshotContainerView(),
    uploadImgView = new UploadImgView(),
    commentSectionView = new CommentSectionView();

function init() {
    console.log("### Starting MME Project ###");
    toolsView.addEventListener("toolAddButtonClicked", onToolAddButtonClicked);

    const el = document.createElement("div"),
        list = document.getElementsByClassName("discussion")[0];
    el.innerHTML = document.getElementById("comment-field-template").innerHTML;
    el.getElementsByClassName("username")[0].innerText = "name";
    el.getElementsByClassName("title")[0].innerText = "title";
    el.getElementsByClassName("message")[0].innerText = "message";

    list.appendChild(el);
}

function onToolAddButtonClicked(event) {
    model.toolAddButtonClicked(event);
}

init();