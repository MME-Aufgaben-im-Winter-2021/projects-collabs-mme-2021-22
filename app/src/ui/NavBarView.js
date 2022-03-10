/* eslint-env browser */

import {Event, Observable} from "../utils/Observable.js";
import ProjectsDropdownMenuView from "./ProjectsDropdownMenuView.js";

class NavBarView extends Observable {

    constructor() {
        super();
        this.body = document.querySelector(".navbar");
        this.userDisplayName = this.body.querySelector(".user-display-name");
        this.logoutButton = this.body.querySelector(".logout-button");
        this.logoutButton.addEventListener("click", this.onLogoutButtonClicked.bind(this));
        this.loginButton = this.body.querySelector(".login-button");
        this.loginButton.addEventListener("click", this.onLoginButtonClicked.bind(this))
        this.homeScreenButton = this.body.querySelector(".home-screen");
        this.homeScreenButton.addEventListener("click", this.displayHomeScreen.bind(this));
        this.newProject = this.body.querySelector(".new-project");
        this.projectsDropdownMenuView = new ProjectsDropdownMenuView(this.body);
    }

    displayHomeScreen() {
        this.notifyAll(new Event("displayHomeScreen", {}));
    }

    onProjectsToolClicked() {
        this.notifyAll(new Event("projectsToolClicked", {}));
    }

    onLogoutButtonClicked() {
        this.notifyAll(new Event("userLoggedOut", {loggedOut: true}));
    }

    onLoginButtonClicked() {
        // TODO: start user login
        this.toggleUIVisibility(true);
    }

    toggleUIVisibility(makeVisible) {
        if (makeVisible) {
            this.projectsDropdownMenuView.dropdownButton.style.display = "flex";
            this.userDisplayName.style.display = "block";
            this.logoutButton.style.display = "block";
            this.newProject.style.display = "block";
            this.loginButton.style.display = "none";
        } else {
            this.projectsDropdownMenuView.dropdownButton.style.display = "none";
            this.userDisplayName.style.display = "none";
            this.logoutButton.style.display = "none";
            this.newProject.style.display = "none";
            this.loginButton.style.display = "block";
        }
    }

}

export default NavBarView;