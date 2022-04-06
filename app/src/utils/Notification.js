import createElementFromHTML from "./Utilities.js";
import CONFIG from "./Config.js";

class Notification {
    constructor(notificationText, isError = false) {
        this.body = createElementFromHTML(document.querySelector("#notification-template").innerHTML);
        if (isError) {
            this.body.querySelector(".icon").src = "resources/icons/error-svgrepo-com.svg";
            this.body.classList.remove("success");
            this.body.classList.add("error");
        }
        this.body.querySelector(".text").innerText = notificationText;
    }

    displayNotification(body) {
        let notification = this.body;
        body.appendChild(notification);
        setTimeout(function() {
            body.removeChild(notification);
        }, CONFIG.NOTIFICATION_DURATION);
    }
}

export default Notification;