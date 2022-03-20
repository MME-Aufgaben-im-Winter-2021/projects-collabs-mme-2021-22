import { Event, Observable } from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";

let voted = false;

function setVotingButton(classNameButton, classNameCount, symbolActive, symbolInactive, templateBody) {
    let button = templateBody.getElementsByClassName(classNameButton)[0],
        buttonCount;

    button.addEventListener("click", () => {
        // TODO: the voting system has a few flaws, mainly this method -> fix later
        buttonCount = templateBody.getElementsByClassName(classNameCount)[0].innerText;
        if (!voted) {
            templateBody.getElementsByClassName(classNameCount)[0].innerText = parseInt(buttonCount) + 1;
            button.innerText = symbolActive;
            voted = !voted;
        } else {
            templateBody.getElementsByClassName(classNameCount)[0].innerText = parseInt(buttonCount) - 1;
            button.innerText = symbolInactive;
            voted = !voted;
        }
    });
}

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
        this.replyButton = this.body.getElementsByClassName("reply")[0];
        if (this.isReply) {
            this.body.style.width = "70vw";
            this.body.style.marginLeft = "50px";
            this.replyButton.classList.add("hidden");
        } else {
            this.replyButton.addEventListener("click", this.reply.bind(this));
        }
        setVotingButton("upvote", "upvote-count", "▲", "△", this.body);
        setVotingButton("downvote", "downvote-count", "▼", "▽", this.body);
    }
}

export default Comment;