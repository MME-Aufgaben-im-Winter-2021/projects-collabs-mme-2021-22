/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";
import ProjectsDropdownMenuView from "./ProjectsDropdownMenuView.js";
import CONFIG from "../../utils/Config.js";

class NavBarView extends Observable {

    //initiates all elements and listeners in the navbar
    constructor() {
        super();
        this.body = createElementFromHTML(document.querySelector("#navbar-template").innerHTML);
        this.userDisplayName = this.body.querySelector(".user-display-name");
        this.logoutButton = this.body.querySelector(".logout-button");
        this.logoutButton.addEventListener("click", this.onLogoutButtonClicked.bind(this));
        this.loginButton = this.body.querySelector(".login-button");
        this.loginButton.addEventListener("click", this.onLoginButtonClicked.bind(this));
        this.newProject = this.body.querySelector(".new-project");
        this.newProject.addEventListener("click", this.onNewProjectClicked.bind(this));
        this.homeScreenButton = this.body.querySelector(".home-screen");
        this.homeScreenButton.addEventListener("click", this.onHomeScreenClicked.bind(this));
        this.projectsDropdownMenuView = new ProjectsDropdownMenuView(this.body);
        this.projectsDropdownMenuView.addEventListener("projectSelected", this.onProjectSelected.bind(this));
    }

    //case homescreen is clicked
    onHomeScreenClicked() {
        if (this.userName === CONFIG.ANONYMOUS_USER_NAME) {
            this.loginButton.style.display = "block";
            this.notifyAll(new Event("anonymousUserLoggedOut"));
        } else {
            this.notifyAll(new Event("homeScreenClicked"));
        }
    }

    //notifies if login button is clicked
    onLoginButtonClicked() {
        this.notifyAll(new Event("requestLogin"));
    }

    //notifies if logout button is clicked
    onLogoutButtonClicked() {
        this.notifyAll(new Event("userLoggedOut"));
    }

    //updates project array
    updateProjectList(projectArray) {
        this.projectsDropdownMenuView.updateProjectList(projectArray);
    }

    //notifies if a project is selected
    onProjectSelected(event) {
        this.notifyAll(new Event("projectSelected", { id: event.data.id, displayName: this.userDisplayName.innerText.toString() }));
    }

    //case new project is clicked
    onNewProjectClicked() {
        this.notifyAll(new Event("createNewProject"));
    }

    //displays the username in the navbar
    displayUserName(userName) {
        this.userName = userName;
        this.userDisplayName.innerHTML = this.userName;
        if (this.userName === CONFIG.ANONYMOUS_USER_NAME) {
            this.loginButton.style.display = "none";
        }
    }

    //makes navbar parts visible if needed
    makeVisible() {
        this.projectsDropdownMenuView.dropdownButton.style.display = "flex";
        this.userDisplayName.style.display = "block";
        this.logoutButton.style.display = "block";
        this.newProject.style.display = "block";
        this.loginButton.style.display = "none";
    }

    //makes navbar parts invisible if needed
    makeInvisible() {
        this.projectsDropdownMenuView.dropdownButton.style.display = "none";
        this.projectsDropdownMenuView.projectListView.style.display = "none";
        if (this.projectsDropdownMenuView.dropdownButton.classList.contains("active")) {
            this.projectsDropdownMenuView.dropdownButton.classList.remove("active");
        }
        this.userDisplayName.style.display = "none";
        this.logoutButton.style.display = "none";
        this.newProject.style.display = "none";
        this.loginButton.style.display = "block";
    }

}

export default NavBarView;