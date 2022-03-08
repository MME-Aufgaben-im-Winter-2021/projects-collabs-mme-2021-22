/* eslint-env browser */

import {Event, Observable} from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";
import ProjectsDropdownMenuView from "../Projects/ProjectsDropdownMenuView.js";

class NavBarView extends Observable {

    constructor(displayName) {
        super();
        this.body = createElementFromHTML(document.querySelector("#navbar-template").innerHTML);
        this.userDisplayName = this.body.querySelector(".user-display-name");
        this.userDisplayName.innerHTML = displayName;
        this.logoutButton = this.body.querySelector(".logout-button");
        this.logoutButton.addEventListener("click", this.onLogoutButtonClicked.bind(this));
        this.projectsDropdownMenuView = new ProjectsDropdownMenuView(this.body);
    }

    onProjectsToolClicked() {
        this.notifyAll(new Event("projectsToolClicked"));
    }

    onLogoutButtonClicked() {
        this.notifyAll(new Event("userLoggedOut"));
    }

}

export default NavBarView;