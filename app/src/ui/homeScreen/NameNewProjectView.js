import { Event, Observable } from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";

class NameNewProjectView extends Observable {

    constructor() {
        super();
        this.body = createElementFromHTML(document.querySelector("#project-screen-template").innerHTML);
        this.newProjectNameInputElement = this.body.querySelector("#enter-project-name");
        this.newProjectNameInputElement.addEventListener("change", this.onProjectNameEntered.bind(this));
    }

    //notifies that a new project was created/named
    onProjectNameEntered() {
        this.notifyAll(new Event("newProjectNameEntered", { newProjectName: this.newProjectNameInputElement.value }));
        this.newProjectNameInputElement.value = "";
    }
}

export default NameNewProjectView;