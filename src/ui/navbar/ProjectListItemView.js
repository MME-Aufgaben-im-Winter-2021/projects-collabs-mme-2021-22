/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";

class ProjectListItemView extends Observable {
    constructor(name, id) {
        super();
        this.id = id;
        this.name = name;
        this.body = createElementFromHTML(document.getElementById("dropdown-list-item-template").innerHTML);
        this.body.querySelector(".project-name").innerHTML = this.name;
        this.body.addEventListener("click", this.onProjectClicked.bind(this));
    }

    onProjectClicked() {
        // pass project data
        this.notifyAll(new Event("projectSelected", { id: this.id }));
    }
}

export default ProjectListItemView;