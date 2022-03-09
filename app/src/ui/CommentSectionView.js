/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import Comment from "./Comment.js";

var canvas = document.getElementsByTagName("canvas");
console.log(canvas);

class CommentSectionView extends Observable {
    constructor(container) {
        super();
        this.discussion = container.querySelector(".discussion");
        this.commentInputElement = container.querySelector(".comment-controls .input-comment");
        this.submitButton = container.querySelector(".comment-controls .submit");
        this.submitButton.addEventListener("click", this.onNewCommentEntered.bind(this));
        this.commentInputElement.addEventListener("change", this.onNewCommentEntered.bind(this));

    }

    onNewCommentEntered() {
        if (this.commentInputElement.value.trim() !== "") { // do not accept empty strings as comment
            this.notifyAll(new Event("newCommentEntered", { commentText: this.commentInputElement.value }));
            this.commentInputElement.value = "";
        }
    }

    addComment(text, id, color, author) {
        let comment = new Comment(this.discussion, text, id, color, author);
        comment.onLoad();
        comment.addEventListener("onReply", this.addReply.bind(this));
    }

    addReply(event) {
        if (this.commentInputElement.value.trim() !== "") { // do not accept empty strings as comment
            this.notifyAll(new Event("newCommentEntered", { commentText: this.commentInputElement.value }));
            let reply = new Comment(this.discussion, this.commentInputElement.value, event.data.commentColor, event.data.isResponse);
            reply.onLoad();
            this.commentInputElement.value = "";
        }
    }

    showComments(comments) {
        this.discussion.innerHTML = "";
        for (const comment of comments) {
            this.addComment(comment.text, comment.id, comment.color, comment.author);
        }
    }
}

export default CommentSectionView;