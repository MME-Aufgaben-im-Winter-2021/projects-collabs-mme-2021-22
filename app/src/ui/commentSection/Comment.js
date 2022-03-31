import { Event, Observable } from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";

function loadCommentTextContent(body, text, author) {
    body.getElementsByClassName("username")[0].innerText = author;
    body.getElementsByClassName("message")[0].innerText = text;
}

class Comment extends Observable {

    constructor(discussion, text, id, color = "#277A8C", author, isReply = false) {
        super();
        this.commentList = discussion;
        this.id = id;
        this.author = author;
        this.body = createElementFromHTML(document.getElementById("comment-field-template").innerHTML);
        this.text = text;
        this.isReply = isReply;
        this.color = color;

        this.isUpvoted = false;
        this.isDownvoted = false;
    }

    reply() {
        this.notifyAll(new Event("onReply", { isResponse: true, commentColor: this.color }));
    }

    onLoad() {
        this.body.style.background = this.color;
        loadCommentTextContent(this.body, this.text, this.author);
        this.initButtons();
        // this.commentList.append(this.body);
        // https://stackoverflow.com/a/618198
        // insert newest comment at the top
        this.commentList.insertBefore(this.body, this.commentList.firstChild);
    }

    initButtons() {
        /*
        TODO: implement reply function -> until it is implemented, we will forget about this option
        this.replyButton = this.body.getElementsByClassName("reply")[0];
        if (this.isReply) {
            this.body.style.width = "70vw";
            this.body.style.marginLeft = "50px";
            this.replyButton.classList.add("hidden");
        } else {
            this.replyButton.addEventListener("click", this.reply.bind(this));
        }
        */
        let upvote = this.body.querySelector(".upvote"),
            downvote = this.body.querySelector(".downvote");
        upvote.addEventListener("click", () => this.setVotingButton(upvote, this.body));
        downvote.addEventListener("click", () => this.setVotingButton(downvote, this.body));
    }

    setVotingButton(button, body) {
        let up = body.querySelector(".upvote"),
            upCount = body.querySelector(".upvote-count"),
            down = body.querySelector(".downvote"),
            downCount = body.querySelector(".downvote-count");
        if (button === up) {
            if (!this.isUpvoted) {
                upCount.innerText = parseInt(upCount.innerText) + 1;
                button.innerText = "▲";
                this.isUpvoted = true;
                if (this.isDownvoted) {
                    downCount.innerText = parseInt(downCount.innerText) - 1;
                    down.innerText = "▽";
                    this.isDownvoted = false;
                }
            } else {
                upCount.innerText = parseInt(upCount.innerText) - 1;
                button.innerText = "△";
                this.isUpvoted = false;
            }
        } else if (button === down) {
            if (!this.isDownvoted) {
                downCount.innerText = parseInt(downCount.innerText) + 1;
                button.innerText = "▼";
                this.isDownvoted = true;
                if (this.isUpvoted) {
                    upCount.innerText = parseInt(upCount.innerText) - 1;
                    up.innerText = "△";
                    this.isUpvoted = false;
                }
            } else {
                downCount.innerText = parseInt(downCount.innerText) - 1;
                button.innerText = "▽";
                this.isDownvoted = false;
            }
        }
    }

}

export default Comment;