/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import Comment from "./Comment.js";

class CommentSectionView extends Observable {
    constructor(container) {
        super();
        this.discussion = container.querySelector(".discussion");
        this.commentInputElement = container.querySelector(".comment-controls .input-comment");
        this.commentInputElement.addEventListener("change", this.onNewCommentEntered.bind(this));
        this.color = "#000000"; //black for default answers without a marking
        this.canvasPNG = undefined;
    }

    onNewCommentEntered() {
        if (this.color === undefined) {
            this.color = "#000000"; //black for default answers without a marking
        }
        if (this.commentInputElement.value.trim() !== "" && this.commentInputElement.value.trim() !== null) { // do not accept empty strings as comment
            this.notifyAll(new Event("newCommentEntered", { commentText: this.commentInputElement.value, color: this.color }));

            if (this.canvasPNG !== undefined) {
                this.notifyAll(new Event("saveCanvas", { canvasPNG: this.canvasPNG })); //TODO: receive notification in db
            }

            this.commentInputElement.value = "";
            this.color = "#000000";
            this.canvasPNG = null;
        } else {
            this.window.alert("You did not enter a valid input!");
        }
    }

    addComment(text, id, color, author) {
        let comment = new Comment(this.discussion, text, id, color, author);
        comment.onLoad();
        comment.addEventListener("onReply", this.addReply.bind(this));
    }

    addReply(event) {
        if (this.commentInputElement.value.trim() !== "") { // do not accept empty strings as comment
            this.notifyAll(new Event("newCommentEntered", { commentText: this.commentInputElement.value, color: this.color }));
            let reply = new Comment(this.discussion, this.commentInputElement.value, event.data.commentColor, event.data.isResponse);
            reply.onLoad();
            this.commentInputElement.value = "";
            this.color = "#000000";
        }
    }

    showComments(comments) {
        this.discussion.innerHTML = "";
        if (comments === undefined) { return; } // if no comments availabla, do not show comments
        for (const comment of comments) {
            this.addComment(comment.text, comment.id, comment.color, comment.author);
        }
    }

    activateInputField(event) {
        this.color = event.data.color;
        this.canvasPNG = event.data.canvasPNG;
        this.commentInputElement.focus();
    }
}

export default CommentSectionView;