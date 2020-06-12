const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
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

//@route    GET api/student/password/reset/email
//@desc     Generate and send Password Reset Url
//@access   private

router.get('/password/reset/:email', async (req, res) => {
    try {
        const email = req.params.email;
        let student = await Student.findOne({email});
        //let bodyHtml = fs.readFileSync(path.resolve(__dirname, '../../resources/resetmail.html'), 'utf8');
        if (!student) {
            let response = {
                success: false,
                msg: "No such user"
            }
            return res.status(400).json(response);
        }

        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "1h"});
        const url = `${process.env.RESET_URL_DOMAIN}/reset-password/${token}`;
        //bodyHtml = bodyHtml.replace(/passwordResetUrl/g, url);
        
        //Send email
        const msg = {
            to: email,
            from: 'no-reply@wingmait.com',
            reply_to: 'hello@wingmait.com',
            subject: 'Forgot your password on wingmait?',
            text: `Hi there,\n\nPlease click the link below to reset your password\n\n${url}\n\nRegards,\nTeam Wingmait`,
            html: `<p>Hi there,</p><p>Please click the link below to reset your password</p><p>${url}</p><p>Regards,<br />Team Wingmait</p>`
        };

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail.send(msg);

        let response = {
            success: true,
            msg: "Message Sent"
        }
        return res.status(200).json(response);
    } catch (err) {
        let response = {
            success: false,
            msg: "Server Error",
            details: "An unexpected error occured while generating password reset url",
            error: err
        }
        return res.status(500).json(response);
    }
})

//@route    PUT api/student/password/reset
//@desc     Generate and send Password Reset Url
//@access   private

router.put("/password/reset", isValidPasswordReset, async (req, res) => {
    try {
        const {
            new_password,
            confirm_new_password,
            token
        } = req.body;

        jwt.verify(token, process.env.JWT_SECRET, async (err, verifiedToken) => {
            if(err){
                let response = {
                    success: false,
                    msg: err.msg,
                    details: "An unexpected error occured while verifying token",
                    error: err
                }
                return res.status(500).json(response);
              }else{
                const {
                    email
                } = verifiedToken;
                //Encrypt password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(new_password, salt);
                await Student.findOneAndUpdate({email}, {local: {password: hashedPassword}})
                let response = {
                    success: true,
                    msg: "Password updated"
                }
                return res.status(200).json(response);
              }
        })

        return res.status(200).send("Ok");
    } catch (err) {
        let response = {
            success: false,
            msg: "Server Error",
            details: "An unexpected error occured while generating reseting password",
            error: err
        }
        return res.status(500).json(response);
    }
})

module.exports = router;