/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import Comment from "./Comment.js";

let isReply;

class CommentSectionView extends Observable {
    constructor(container) {
        super();
        this.discussion = container.querySelector(".discussion");
        this.commentInputElement = container.querySelector(".input-comment");
        this.submitButton = container.querySelector(".comment-controls .submit");
        this.submitButton.addEventListener("click", this.onCommentEntered.bind(this));
        this.commentInputElement.addEventListener("change", this.onCommentEntered.bind(this));

    }

    onCommentEntered() {
        console.log("added comment");
        if (this.commentInputElement.value !== "") { // do not accept empty strings as comment
            this.notifyAll(new Event("commentEntered", { commentText: this.commentInputElement.value, isReply: false }));
            this.commentInputElement.value = "";
        }
    }

    addComment(text, reply) {
        let comment = new Comment(this.discussion, text);
        comment.onLoad(reply);
        comment.addEventListener("onReply", this.addReply.bind(this));
    }

    addReply(event) {
        console.log("add reply");
        if (this.commentInputElement.value.trim() !== "") { // do not accept empty strings as comment
            isReply = event.data.isReply;
            console.log(event.data.isReply);
            this.onCommentEntered();
            this.commentInputElement.value = "";
        }
    }

}

export default CommentSectionView;