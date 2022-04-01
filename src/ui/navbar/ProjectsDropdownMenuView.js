/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import ProjectListItemView from "./ProjectListItemView.js";

class ProjectsDropdownMenuView extends Observable {

    //initiates all elements and their listeners
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

    //case dropdown button was clicked - show or hide dropdown
    onDropdownButtonClicked() { // opens listing of projects
        this.dropdownButton.classList.toggle("active");
        if (this.projectListView.style.display === "block") {
            this.projectListView.style.display = "none";
        } else {
            this.projectListView.style.display = "block";
        }
    }

    //adds projectListView
    addProjectToProjectListView(name, id) {
        const projectListItemView = new ProjectListItemView(name, id);
        projectListItemView.addEventListener("projectSelected", this.onProjectSelected.bind(this));
        this.projectListView.appendChild(projectListItemView.body);
    }


    //notifies which project in the dropdown was selected
    onProjectSelected(event) {
        console.log("selected project with id: " + event.data.id);
        this.notifyAll(new Event("projectSelected", { id: event.data.id }));
    }

    //updates the project list to see if a new project should be listed
    updateProjectList(projectArray) {
        this.projectListView.innerHTML = ""; // deletes everything from list before updating
        for (const project of projectArray) {
            this.addProjectToProjectListView(project.name, project.id);
        }
    }
}

export default ProjectsDropdownMenuView;