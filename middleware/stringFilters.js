const escapeSpecChars = (str) => {
    return str
        .replace(/\$/g, "&#038;")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export default escapeSpecChars;