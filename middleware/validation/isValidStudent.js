const util = require('../util');

module.exports = (req, res, next) => {
    const {
        name,
        email,
        password,
        confirm_password
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

    if (!util.isPassword(password)) {

        if (password.length < 6) {
            let response = {
                success: false,
                msg: "Password must have 6 characters or more",
                details: "A valid password with 6 or more characters is mandatory to create an account."
            }
            return res.status(400).json(response);
        } else {
            let response = {
                success: false,
                msg: "Password cannot contain white spaces.",
                details: "What space is not allowed."
            }
            return res.status(400).json(response);
        }
    }

    if (password !== confirm_password) {
        let response = {
            success: false,
            msg: "Passwords do not match",
            details: "Passwords must match for an account to be created."
        }
        return res.status(400).json(response);
    }

    next();
}