/* eslint-env browser */

import {Event, Observable} from "../utils/Observable.js";

class ToolsView extends Observable {
    constructor() {
        super();
        this.initButtons();
    }

    initButtons() {
        this.addButton = document.querySelector(".tools .add");
        this.addButton.addEventListener("click", this.onAddButtonClicked.bind(this));
        this.deleteButton = document.querySelector(".tools .delete");
        this.deleteButton.addEventListener("click", this.onDeleteButtonClicked.bind(this));
        this.saveButton = document.querySelector(".tools .save");
        this.saveButton.addEventListener("click", this.onSaveButtonClicked.bind(this));
        this.addCommentButton = document.querySelector(".tools .add-comment");
        this.addCommentButton.addEventListener("click", this.onAddCommentButtonClicked.bind(this));
    }

    onAddButtonClicked() {
        console.log("onAddButtonClicked");
        this.notifyAll(new Event("toolAddButtonClicked"));
    }
    
    onDeleteButtonClicked() {
        console.log("onDeleteButtonClicked");
        this.notifyAll(new Event("toolDeleteButtonClicked"));
    }
    
    onSaveButtonClicked() {
        console.log("onSaveButtonClicked");
        this.notifyAll(new Event("toolSaveButtonClicked"));
    }
    
    onAddCommentButtonClicked() {
        console.log("onAddCommentButtonClicked");
        this.notifyAll(new Event("toolAddCommentButtonClicked"));
    }
}

export default ToolsView;