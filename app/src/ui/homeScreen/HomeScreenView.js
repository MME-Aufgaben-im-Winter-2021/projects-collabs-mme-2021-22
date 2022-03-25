import { Event, Observable } from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";
import CONFIG from "../../utils/Config.js";

class HomeScreenView extends Observable {

    constructor() {
        super();
        this.body = createElementFromHTML(document.querySelector("#home-screen-template").innerHTML);
        this.projectKeyInputElement = this.body.querySelector(".enter-project-key");
        this.projectKeyInputElement.addEventListener("change", this.onProjectKeyEntered.bind(this));
    }

    onProjectKeyEntered() {
        this.projectKeyInputElement.value = this.projectKeyInputElement.value.trim();
        console.log(this.projectKeyInputElement.value.length);
        if (this.projectKeyInputElement.value.length !== CONFIG.KEY_LENGTH) {
            this.showError();
        } else {
            this.notifyAll(new Event("projectKeyEntered", { projectKey: this.projectKeyInputElement.value }));
            this.projectKeyInputElement.value = "";
        }
    }

    showError() {
        this.projectKeyInputElement.classList.add("show-error-animation");
        setTimeout(() => this.projectKeyInputElement.classList.remove("show-error-animation"), CONFIG.ONE_SECOND_DELAY);
        this.projectKeyInputElement.value = "";
    }
}

export default HomeScreenView;