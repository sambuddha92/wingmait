const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const mongoose = require('mongoose');
require('dotenv').config();

let s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1',
    signatureVersion: 'v4'
});

const s3Bucket = 'wingmait-course';
const Lesson = require('../../models/lesson.js');
const Course = require('../../models/course.js');


//@route    GET api/lesson/id/courseid
//@desc     Get MyAccount Resource
//@access   private

router.get("/:id/:courseid", async (req, res) => {
    try {
        const {
            id,
            courseid
        } = req.params;

        const course = await Course.findById(courseid);
        const courselesson = course.lessons.filter(lesson => lesson.lesson.toString() === id)[0];
        const access = courselesson.access;
        if (access !== "Preview" && !req.isAuthenticated()) {
            let response = {
                success: false,
                payload: {
                    url: "",
                    result: "LOGIN_REQUIRED"
                }
            }
            return res.status(200).json(response);
        }
        const lesson = await Lesson.findById(courselesson.lesson);
        let filekey = '';

        if (lesson.lessontype === "VIDEO") {
            filekey = lesson.video.key
        }

        if (lesson.lessontype === "DOC") {
            filekey = lesson.doc.key
        }

        let params = {
            Bucket: s3Bucket,
            Key: filekey,
            Expires: 28800
        }
    
        let url = s3.getSignedUrl('getObject', params);
        let response = {
            success: true,
            payload: {
                url,
                result: lesson.lessontype
            }
        }
        return res.status(200).json(response);
        
    } catch (err) {
        let response = {
            success: false,
            msg: "Server error",
            details: "An unexpected error occured while getting lesson url",
            err
        }
        return res.status(500).json(response);
        
    }
})

module.exports = router;