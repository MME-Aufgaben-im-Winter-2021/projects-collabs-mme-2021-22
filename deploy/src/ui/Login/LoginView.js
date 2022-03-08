/* eslint-env browser */

// import { Event, Observable } from "../utils/Observable.js";
import {Event, Observable} from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";
import CONFIG from "../../utils/Config.js";

function loginSuccessful(username, password) {
    // TODO: delete/"adjust" later
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
        this.loginButton = this.body.querySelector(".login-button");
        this.usernameInput = this.body.querySelector(".username.input-user-data");
        this.passwordInput = this.body.querySelector(".password.input-user-data");
        this.loginButton.addEventListener("click", this.onPerformLogin.bind(this));
        this.passwordInput.addEventListener("change", this.onPerformLogin.bind(this));
    }

    onPerformLogin() {
        if (loginSuccessful(this.usernameInput.value, this.passwordInput.value)) {
            this.notifyAll(new Event("userLoggedIn"));
        } else {
            // show error animation
            this.body.classList.add("show-error-animation");
            setTimeout(() => stopAnimation(this.body, this.passwordInput), CONFIG.DURATION_ERROR_ANIMATION_MS);
        }
    }
}

export default LoginView;