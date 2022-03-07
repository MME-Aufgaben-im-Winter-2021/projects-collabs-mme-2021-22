/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import Comment from "./Comment.js";

var canvas = document.getElementsByTagName("canvas");

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
        if (this.commentInputElement.value.trim() !== "") { // do not accept empty strings as comment
            this.notifyAll(new Event("commentEntered", { commentText: this.commentInputElement.value }));
            this.commentInputElement.value = "";
        }
    }

    addComment(text) {
        let test = new Comment(this.discussion, text);
        test.onLoad();
        test.addEventListener("onReply", this.addReply.bind(this));
    }

    addReply(event) {
        if (this.commentInputElement.value.trim() !== "") { // do not accept empty strings as comment
            this.notifyAll(new Event("commentEntered", { commentText: this.commentInputElement.value }));
            let reply = new Comment(this.discussion, this.commentInputElement.value, event.data.isResponse, event.data.commentColor);
            reply.onLoad();
            this.commentInputElement.value = "";
        }
    }

}

export default CommentSectionView;