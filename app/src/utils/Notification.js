import createElementFromHTML from "./Utilities.js";
import CONFIG from "./Config.js";

class Notification {
    constructor(notificationText, isError) {
        this.body = createElementFromHTML(document.querySelector("#notification-template").innerHTML);
        if (isError) {
            this.body.querySelector(".icon").src = "resources/icons/error-svgrepo-com.svg";
            this.body.classList.remove("success");
            this.body.classList.add("error");
        }
        this.body.querySelector(".text").innerText = notificationText;
    }

    displayNotification() {
        document.body.appendChild(this.body);
        setTimeout(() => {
            document.body.removeChild(this.body);
        }, CONFIG.NOTIFICATION_DURATION);
    }
}

function createNotification(text, isErrorNotification = false) {
    const notification = new Notification(text, isErrorNotification);
    notification.displayNotification();
}

export { createNotification };