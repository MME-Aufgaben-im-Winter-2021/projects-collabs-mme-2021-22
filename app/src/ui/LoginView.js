/* eslint-env browser */

// import { Event, Observable } from "../utils/Observable.js";
import {Event, Observable} from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";

class LoginView extends Observable {
    constructor() {
        super();
        this.body = createElementFromHTML(document.querySelector("#login-template").innerHTML);
        this.body.querySelector(".login-button").addEventListener("click", this.onLoginButtonClicked.bind(this));
    }

    onLoginButtonClicked() {
        this.notifyAll(new Event("userLoggedIn"));
    }
}

export default LoginView;