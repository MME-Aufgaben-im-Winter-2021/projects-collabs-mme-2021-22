/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import createElementFromHTML from "../utils/Utilities.js";

class CommentSectionView extends Observable {
    constructor(container) {
        super();
        this.discussion = container.querySelector(".discussion");
        this.commentInputElement = container.querySelector(".comment-controls .input-comment");
        this.submitButton = container.querySelector(".comment-controls .submit");
        this.submitButton.addEventListener("click", this.onCommentEntered.bind(this));
        this.commentInputElement.addEventListener("change", this.onCommentEntered.bind(this));
    }

    onCommentEntered() {
        if (this.commentInputElement.value !== "") { // do not accept empty strings as comment   
            this.notifyAll(new Event("commentEntered", { commentText: this.commentInputElement.value }));
            this.commentInputElement.value = "";
        }
    }

    addComment(text) {
        const commentFieldTemplate = createElementFromHTML(document.getElementById("comment-field-template").innerHTML);
        commentFieldTemplate.querySelector(".username").innerHTML = "Max Mustermann";
        commentFieldTemplate.querySelector(".message").innerHTML = text;
        this.discussion.appendChild(commentFieldTemplate);
    }
}

export default CommentSectionView;