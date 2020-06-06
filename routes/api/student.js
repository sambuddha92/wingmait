const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Student = require('../../models/student.js');
const {isValidStudent} = require('../../middleware/validation');

//@route    POST api/student
//@desc     Register a student
//@access   public

router.post('/', [upload.none(), isValidStudent], async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        let student = await Student.findOne({email});

        if (student) {
            let response = {
                success: false,
                msg: "Email already in use"
            }
            return res.status(400).json(response);
        }

        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        student = new Student({
            name,
            email,
            local: {
                password : hashedPassword
            }
        });

        //Save Student
        await student.save();

        let response = {
            success: true,
            msg: "Registered"
        }

        return res.status(200).json(response);

    } catch (err) {
        let response = {
            success: false,
            msg: "Server Error",
            details: "An unexpected error occured while getting all courses",
            error: err
        }
        return res.status(500).json(response);
    }
})

module.exports = router;