const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const AWS = require('aws-sdk');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

let s3 = new AWS.S3({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'ap-south-1', signatureVersion: 'v4'});

const s3Bucket = 'wingmait-interaction';

// @route    POST api/interaction/contact
// @desc     Post message from contact form
// @access   public

router.post('/contact', upload.none(), async(req, res) => {
    try {
        const {name, email, message} = req.body;

        //Send email to new user
        const msg = {
            to: 'hello@wingmait.com',
            from: 'carlos-noreply@wingmait.com',
            reply_to: email,
            subject: 'New message from website contact form',
            text: `Message: ${message}\nFrom: ${name}\nEmail: ${email}`,
            html: `<p><strong>Message:</strong> ${message}</p><p><strong>From:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p>`
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
            details: "An unexpected error occured while sending message",
            error: err
        }
        return res.status(500).json(response);
    }
})

module.exports = router;