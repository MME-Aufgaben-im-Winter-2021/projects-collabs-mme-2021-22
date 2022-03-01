/* eslint-env browser */

// import { Event, Observable } from "../utils/Observable.js";
import {Event, Observable} from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";
import CONFIG from "../utils/Config.js";

function loginSuccessful(username, password) {
    // TODO: add method to verify user information by accessing the database
    return username === "username" && password === "password";
}

function stopAnimation(input, password) {
    input.classList.remove("show-error-animation");
    // only clear password value
    password.value = "";
}

class LoginView extends Observable {
    constructor() {
        super();
        this.body = createElementFromHTML(document.querySelector("#login-template").innerHTML);
        this.body.querySelector(".login-button").addEventListener("click", this.onLoginButtonClicked.bind(this));
    }

    onLoginButtonClicked() {
        let username = this.body.getElementsByClassName("username")[0],
            password = this.body.getElementsByClassName("password")[0];
        if (loginSuccessful(username.value, password.value)) {
            this.notifyAll(new Event("userLoggedIn"));
        } else {
            // show error animation
            this.body.classList.add("show-error-animation");
            setTimeout(() => stopAnimation(this.body, password), CONFIG.DURATION_ERROR_ANIMATION_MS);

        }
    }
}

export default LoginView;