import Observable from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";

class HomeScreenView extends Observable{

    constructor() {
        super();
        this.body = createElementFromHTML(document.querySelector("#home-screen-template").innerHTML);
        this.inputProjectKey = this.body.querySelector(".enter-project-key");
    }

    onProjectKeyEntered() {
        // TODO: load project
    }
}

export default HomeScreenView;