function createElementFromHTML(htmlString) {
    // Method taken from https://stackoverflow.com/a/494348
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function checkUrlValid(url) {
    // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    // const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
    //     "((([a-z\\d]([a-z\\d-][a-z\\d]))\\.?)+[a-z]{2,}|" + // domain name
    //     "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    //     "(\\:\\d+)?(\\/[-a-z\\d%.~+])" + // port and path
    //     "(\\?[;&a-z\\d%.~+=-])?" + // query string
    //     "(\\#[-a-z\\d_])?$", "i"); // fragment locator
    const pattern = new RegExp("https?");
    return pattern.test(url);
}

function generateRandomRGBString() {
    // https://stackoverflow.com/a/5365036
    // eslint-disable-next-line no-magic-numbers
    return "#" + ((1 << 24) * Math.random() | 0).toString(16);
}

export { createElementFromHTML, checkUrlValid, generateRandomRGBString };

export default createElementFromHTML;