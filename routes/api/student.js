const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Student = require('../../models/student.js');
const {isValidStudent, isValidAccount, isValidPasswordReset} = require('../../middleware/validation');

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
            details: "An unexpected error occured while registering student",
            error: err
        }
        return res.status(500).json(response);
    }
})

//@route    PUT api/student/account
//@desc     Update a student account
//@access   private

router.put('/account', isValidAccount, (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const {
                name,
                email,
                password
            } = req.body;

            let student = req.user;

            //Match Password
             bcrypt.compare(password, student.local.password, async (err, isMatch) => {
                if (err) throw err;
                if(isMatch) {
                    student = await Student.findByIdAndUpdate(student.id, {name, email}, {new: true});
                    let response = {
                        success: true,
                        msg: "Account updated",
                        payload: {
                            name: student.name,
                            email: student.email
                        }
                    }
                    return res.status(200).json(response);
                } else {
                    let response = {
                        success: false,
                        msg: "Unauthorized",
                        details: "Request could not be authenticated",
                    }
                    return res.status(401).json(response);
                }
            });
        } else {
            let response = {
                success: false,
                msg: "Unauthorized",
                details: "Request could not be authenticated",
            }
            return res.status(401).json(response);
        }
        
    } catch (err) {
        let response = {
            success: false,
            msg: "Server Error",
            details: "An unexpected error occured while updating student",
            error: err
        }
        return res.status(500).json(response);
    }
})

//@route    PUT api/student/password
//@desc     Update a student password
//@access   private

router.put('/password', isValidPasswordReset, (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const {
                password,
                new_password
            } = req.body;

            let student = req.user;
            //Match Password
             bcrypt.compare(password, student.local.password, async (err, isMatch) => {
                if (err) throw err;
                if(isMatch) {
                    //Encrypt password
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(new_password, salt);
                    student = await Student.findByIdAndUpdate(student.id, {local: {password: hashedPassword}}, {new: true});
                    let response = {
                        success: true,
                        msg: "Password updated"
                    }
                    return res.status(200).json(response);
                } else {
                    let response = {
                        success: false,
                        msg: "Unauthorized",
                        details: "Request could not be authenticated",
                    }
                    return res.status(401).json(response);
                }
            });
        } else {
            let response = {
                success: false,
                msg: "Unauthorized",
                details: "Request could not be authenticated",
            }
            return res.status(401).json(response);
        }
        
    } catch (err) {
        let response = {
            success: false,
            msg: "Server Error",
            details: "An unexpected error occured while updating student",
            error: err
        }
        return res.status(500).json(response);
    }
})

module.exports = router;