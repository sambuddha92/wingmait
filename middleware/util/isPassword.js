module.exports = (str) => {
    const re = /^[\S]{6,}$/;
    return(re.test(str));
}