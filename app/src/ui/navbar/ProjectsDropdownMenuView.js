/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import ProjectListItemView from "./ProjectListItemView.js";

class ProjectsDropdownMenuView extends Observable {

    constructor(navBarBody) {
        super();
        this.body = navBarBody.querySelector(".dropdown-menu");
        this.projectListView = this.body.querySelector(".dropdown-list");
        this.dropdownButton = this.body.querySelector(".dropdown-button");
        this.dropdownButton.addEventListener("click", this.onDropdownButtonClicked.bind(this));
        this.newProjectButton = this.body.querySelector(".new-project");
        //this.newProjectButton.addEventListener("click", this.loadNewProject.bind(this));
        this.displayName = this.body.querySelector(".user-display-name").innerHTML;
    }

    onDropdownButtonClicked() { // opens listing of projects
        this.dropdownButton.classList.toggle("active");
        if (this.projectListView.style.display === "block") {
            this.projectListView.style.display = "none";
        } else {
            this.projectListView.style.display = "block";
        }
    }

    addProjectToProjectListView(name, id) {
        const projectListItemView = new ProjectListItemView(name, id);
        projectListItemView.addEventListener("projectSelected", this.onProjectSelected.bind(this));
        this.projectListView.appendChild(projectListItemView.body);
    }

    onProjectSelected(event) {
        // TODO: Update Project list after adding new Project
        console.log("selected project with id: " + event.data.id);
        this.notifyAll(new Event("projectSelected", { id: event.data.id }));
    }

    updateProjectList(projectArray) {
        this.projectListView.innerHTML = ""; // deletes everything from list before updating
        for (const project of projectArray) {
            this.addProjectToProjectListView(project.name, project.id);
        }
    }

    loadNewProject() {
        /* TODO: 
        let body = document.querySelector("body");
        for (let i = 0; i < elementsToDeleteLength; i++) {
            body.removeChild(body.lastChild);
        }
        this.mainUIHandler.buildUIAfterLogin(this.displayName);*/
        //this.window.location.reload();
    }
}

export default ProjectsDropdownMenuView;