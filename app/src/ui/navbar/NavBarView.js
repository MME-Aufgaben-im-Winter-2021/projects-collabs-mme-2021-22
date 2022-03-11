/* eslint-env browser */

import {Event, Observable} from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";
import ProjectsDropdownMenuView from "./ProjectsDropdownMenuView.js";

class NavBarView extends Observable {

    constructor(displayName) {
        super();
        this.body = createElementFromHTML(document.querySelector("#navbar-template").innerHTML);
        this.userDisplayName = this.body.querySelector(".user-display-name");
        this.userDisplayName.innerHTML = displayName;
        this.logoutButton = this.body.querySelector(".logout-button");
        this.logoutButton.addEventListener("click", this.onLogoutButtonClicked.bind(this));
        this.newProject = this.body.querySelector(".new-project");
        this.homeScreenButton = this.body.querySelector(".home-screen");
        this.homeScreenButton.addEventListener("click", this.onHomeScreenClicked.bind(this));
        this.projectsDropdownMenuView = new ProjectsDropdownMenuView(this.body);
        this.projectsDropdownMenuView.addEventListener("projectSelected", this.onProjectSelected.bind(this));
    }

    onHomeScreenClicked() {
        this.notifyAll(new Event("homeScreenClicked"));
    }

    onProjectsToolClicked() {
        this.notifyAll(new Event("projectsToolClicked"));
    }

    onLogoutButtonClicked() {
        this.notifyAll(new Event("userLoggedOut"));
    }

    updateProjectList(projectArray) {
        this.projectsDropdownMenuView.updateProjectList(projectArray);
    }

    onProjectSelected(event) {
        this.notifyAll(new Event("projectSelected", { id: event.data.id, displayName: this.userDisplayName.innerText.toString() }));
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