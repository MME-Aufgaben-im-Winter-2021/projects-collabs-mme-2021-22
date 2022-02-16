/* eslint-env browser */

function init() {
    console.log("### Starting MME Project ###");
    const   el = document.createElement("div"),
            list = document.getElementsByClassName("discussion")[0];
    el.innerHTML = document.getElementById("comment-field-template").innerHTML;
    el.getElementsByClassName("username")[0].innerText = "name";
    el.getElementsByClassName("title")[0].innerText = "title";
    el.getElementsByClassName("message")[0].innerText = "message";

    list.appendChild(el);
}

init();