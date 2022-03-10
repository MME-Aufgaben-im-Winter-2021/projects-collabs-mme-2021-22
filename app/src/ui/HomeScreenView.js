import Observable from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";

class HomeScreenView extends Observable{

    constructor() {
        super();
        this.body = createElementFromHTML(document.querySelector("#home-screen-template").innerHTML);
        this.inputProjectKey = this.body.querySelector(".enter-project-key");
        this.userProjectsList = this.body.querySelector(".user-projects");
        addSomeItemsToList(this.userProjectsList);
    }

    onProjectKeyEntered() {
        // TODO: load project
    }

    onUserLoggedIn() {
        // TODO: user's projects to userProjectList
    }
}

// TODO: debug function -> delete later
function addSomeItemsToList(projectList) {
    for (let i = 0; i < 5; i++) {
        let temp = new ProjectPreviewItem();
        projectList.appendChild(temp.body);
    }
}

class ProjectPreviewItem extends Observable {

    constructor() {
        super();
        this.body = createElementFromHTML(document.querySelector("#project-list-item-template").innerHTML);
        this.title = this.body.querySelector(".project-title");
        this.image = this.body.querySelector(".project-preview-picture");

    }
}

export default HomeScreenView;