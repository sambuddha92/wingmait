const util = require('../util');

module.exports = (req, res, next) => {
    const {
        new_password,
        confirm_new_password
    } = req.body;
    if (!util.isPassword(new_password)) {
        let response = {
            success: false,
            msg: "Password must be 6 characters or longer",
        }
        return res.status(400).json(response);
    }

    if (new_password !== confirm_new_password) {
        let response = {
            success: false,
            msg: "Passwords do not match",
        }
        return res.status(400).json(response);
    }

    next();
}