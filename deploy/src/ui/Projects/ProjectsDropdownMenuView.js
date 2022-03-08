/* eslint-env browser */

import { Observable } from "../../utils/Observable.js";
import ProjectListItemView from "./ProjectListItemView.js";

class ProjectsDropdownMenuView extends Observable {

    constructor(toolBarBody) {
        super();
        this.body = toolBarBody.querySelector(".dropdown-menu");
        this.projectListView = this.body.querySelector(".dropdown-list");
        this.initDropdownButton();
        this.addProjectToProjectListView();
    }

    initDropdownButton() {
        const dropdownButton = this.body.getElementsByClassName("dropdown-button")[0];
        dropdownButton.addEventListener("click", () => {
            dropdownButton.classList.toggle("active");
            const content = this.body.getElementsByClassName("dropdown-list")[0];
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

    addProjectToProjectListView() {
        for (let i = 0; i < 3; i++) {
            const projectListItemView = new ProjectListItemView();
            projectListItemView.addEventListener("projectSelected", this.onProjectSelected.bind(this));
            this.projectListView.appendChild(projectListItemView.body);
        }
    }

    onProjectSelected(event) {
        console.log("selected project with id: " + event.data.id);
    }

}

export default ProjectsDropdownMenuView;