/* eslint-env browser */

import {Event, Observable} from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";

class ToolBarView extends Observable {
    // TODO: Dropdown menu
    constructor() {
        super();
        this.body = createElementFromHTML(document.querySelector("#toolbar-template").innerHTML);
        this.body.querySelector(".dropdown-description").addEventListener("click", this.onProjectsToolClicked.bind(this));
    }

    onProjectsToolClicked() {
        this.notifyAll(new Event("projectsToolClicked"));
    }
}

export default ToolBarView;