/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import ProjectListItemView from "./ProjectListItemView.js";

class ProjectsDropdownMenuView extends Observable {

    constructor(toolBarBody) {
        super();
        this.body = toolBarBody.querySelector(".dropdown-menu");
        this.projectListView = this.body.querySelector(".dropdown-list");
        this.dropdownButton = this.body.querySelector(".dropdown-button");
        this.dropdownButton.addEventListener("click", this.onDropdownButtonClicked.bind(this));
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
        console.log("selected project with id: " + event.data.id);
        this.notifyAll(new Event("projectSelected", { id: event.data.id }));
    }

    updateProjectList(projectArray) {
        this.projectListView.innerHTML = ""; // deletes everything from list before updating
        for (const project of projectArray) {
            this.addProjectToProjectListView(project.name, project.id);
        }
    }
}

export default ProjectsDropdownMenuView;