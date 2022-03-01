/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import ProjectListItemView from "./ProjectListItemView.js";

class ProjectsDropdownMenuView extends Observable {
    constructor(toolBarBody) {
        super();
        this.body = toolBarBody.querySelector(".dropdown-container");
        this.searchInputElement = this.body.querySelector("input.input-search-bar");
        this.searchButton = this.body.querySelector(".search-button");
        this.projectListView = this.body.querySelector(".dropdown-list");
        this.searchInputElement.addEventListener("change", this.onSearchTermEntered.bind(this));
        this.searchButton.addEventListener("click", this.onSearchTermEntered.bind(this));
        this.addProjectToProjectListView();
    }

    toggle() {
        this.body.classList.toggle("hidden");
        if(this.body.classList.contains("hidden")) {
            console.log("Dropdown now hidden");
        } else {
            console.log("Dropdown now viewable");
        }
    }

    onSearchTermEntered() {
        if (this.searchInputElement.value !== "") { // do not accept empty strings to search   
            this.searchInputElement.value = "";
        }
    }

    addProjectToProjectListView() {
        const projectListItemView = new ProjectListItemView();
        projectListItemView.addEventListener("projectSelected", this.onProjectSelected.bind(this));
        this.projectListView.appendChild(projectListItemView.body);
    }

    onProjectSelected(event) {
        console.log("selected project with id: " + event.data.id);
    }
}

export default ProjectsDropdownMenuView;