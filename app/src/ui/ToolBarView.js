/* eslint-env browser */

import {Event, Observable} from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";
import ProjectsDropdownMenuView from "./ProjectsDropdownMenuView.js";

class ToolBarView extends Observable {
    // TODO: Dropdown menu
    constructor() {
        super();
        this.body = createElementFromHTML(document.querySelector("#toolbar-template").innerHTML);
        this.body.querySelector(".dropdown-description").addEventListener("click", this.onProjectsToolClicked.bind(this));
        this.projectsDropdownMenuView = new ProjectsDropdownMenuView(this.body);  
    }

    onProjectsToolClicked() {
        this.notifyAll(new Event("projectsToolClicked"));
        this.projectsDropdownMenuView.toggle();
    }
}

export default ToolBarView;