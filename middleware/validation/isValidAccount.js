const util = require('../util');

module.exports = (req, res, next) => {
    const {
        name,
        email
    } = req.body;

    if (!util.isName(name)) {
        let response = {
            success: false,
            msg: "Name Missing",
            details: "Name is mandatory to create an account."
        }
        return res.status(400).json(response);
    }

    if (!util.isEmail(email)) {
        let response = {
            success: false,
            msg: "Invalid Email Id",
            details: "A valid Email ID is mandatory to create an account."
        }
        return res.status(400).json(response);
    }

    next();
}