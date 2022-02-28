function createElementFromHTML(htmlString) {
    // Method taken from https://stackoverflow.com/a/494348
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

export default createElementFromHTML;