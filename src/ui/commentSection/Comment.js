import { Event, Observable } from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";

class Comment extends Observable {

    constructor(discussion, text, id, color = "#277A8C", author, upvotes = 0, downvotes = 0, currentUserHasUpvoted = false, currentUserHasDownvoted = false, isReply = false) {
        super();
        this.commentList = discussion;
        this.id = id;
        this.author = author;
        this.body = createElementFromHTML(document.getElementById("comment-field-template").innerHTML);
        this.text = text;
        this.isReply = isReply;
        this.color = color;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.isUpvoted = currentUserHasUpvoted;
        this.isDownvoted = currentUserHasDownvoted;
    }

    reply() {
        this.notifyAll(new Event("onReply", { isResponse: true, commentColor: this.color }));
    }

    //loads style and content an buttons in commentSectionView
    onLoad() {
        this.body.style.background = this.color;
        this.setContent(this.text, this.author, this.upvotes, this.downvotes);
        this.initButtons();
        this.commentList.insertBefore(this.body, this.commentList.firstChild);
    }

    //sets content
    setContent(text, author, upvotes, downvotes) {
        this.body.getElementsByClassName("username")[0].innerText = author;
        this.body.getElementsByClassName("message")[0].innerText = text;
        let upCount = this.body.querySelector(".upvote-count"),
            downCount = this.body.querySelector(".downvote-count");
        upCount.innerHTML = upvotes;
        downCount.innerHTML = downvotes;
    }

    //initates comment buttons
    initButtons() {
        let upvote = this.body.querySelector(".upvote"),
            downvote = this.body.querySelector(".downvote");
        if (this.isUpvoted) {
            upvote.innerHTML = "▲";
        } else if (this.isDownvoted) {
            downvote.innerHTML = "▼";
        }
        upvote.addEventListener("click", () => this.setVotingButton(upvote, this.body));
        downvote.addEventListener("click", () => this.setVotingButton(downvote, this.body));
    }

    //checks what is voted for and handles new voting input
    setVotingButton(button, body) {
        let up = body.querySelector(".upvote"),
            upCount = body.querySelector(".upvote-count"),
            down = body.querySelector(".downvote"),
            downCount = body.querySelector(".downvote-count");
        if (button === up) {
            if (!this.isUpvoted) {
                upCount.innerText = parseInt(upCount.innerText) + 1;
                button.innerText = "▲";
                this.notifyAll(new Event("commentUpvoted", { commentID: this.id }));
                this.isUpvoted = true;
                if (this.isDownvoted) {
                    downCount.innerText = parseInt(downCount.innerText) - 1;
                    down.innerText = "▽";
                    this.isDownvoted = false;
                }
            } else {
                upCount.innerText = parseInt(upCount.innerText) - 1;
                this.notifyAll(new Event("commentUndoVote", { commentID: this.id }));
                button.innerText = "△";
                this.isUpvoted = false;
            }
        } else if (button === down) {
            if (!this.isDownvoted) {
                downCount.innerText = parseInt(downCount.innerText) + 1;
                button.innerText = "▼";
                this.notifyAll(new Event("commentDownvoted", { commentID: this.id }));
                this.isDownvoted = true;
                if (this.isUpvoted) {
                    upCount.innerText = parseInt(upCount.innerText) - 1;
                    up.innerText = "△";
                    this.isUpvoted = false;
                }
            } else {
                downCount.innerText = parseInt(downCount.innerText) - 1;
                button.innerText = "▽";
                this.notifyAll(new Event("commentUndoVote", { commentID: this.id }));
                this.isDownvoted = false;
            }
        }
    }

}

export default Comment;