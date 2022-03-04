import Observable from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";

class Comment extends Observable{

    constructor() {
        super();
        this.body = createElementFromHTML(document.getElementById("comment-field-template").innerHTML);
        // TODO: implement further
    }

    onLoad() {
        let username = document.getElementsByClassName("user-display-name")[0].innerText;
        console.log(username);
    }
}

export default Comment;