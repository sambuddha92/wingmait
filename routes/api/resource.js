const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
require('dotenv').config();

let s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1',
    signatureVersion: 'v4'
});

const s3Bucket = 'wingmait-course';

const Student = require('../../models/student.js');
const Course = require('../../models/course.js');
const Teacher = require('../../models/teacher.js');
const Lesson = require('../../models/lesson.js');

//@route    GET api/resource/my-wingmait
//@desc     Get MyWingmait Resource
//@access   private

router.get('/my-wingmait', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            let response = {
                success: true,
                msg: "My Page Data",
                payload: {
                    name: req.user.name,
                    enrolments: req.user.enrolments,
                    payments: req.user.payments
                }
            }
            return res.status(200).json(response);
        } else {
            let response = {
                success: false,
                msg: "Unauthorized"
            }
            return res.status(401).json(response)
        }
    } catch (err) {
        let response = {
            success: false,
            msg: "Server error",
            details: "An unexpected error occured while getting mypage",
            err
        }
        return res.status(500).json(response);
    }
})

//@route    GET api/page/my-account
//@desc     Get MyAccount Resource
//@access   private

router.get('/my-account', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            let response = {
                success: true,
                msg: "My Page Data",
                payload: {
                    name: req.user.name,
                    email: req.user.email
                }
            }
            return res.status(200).json(response);
        } else {
            let response = {
                success: false,
                msg: "Unauthorized"
            }
            return res.status(401).json(response)
        }
    } catch (err) {
        let response = {
            success: false,
            msg: "Server error",
            details: "An unexpected error occured while getting mypage",
            err
        }
        return res.status(500).json(response);
    }
})

//@route    GET api/resource/all-courses
//@desc     Get MyAccount Resource
//@access   private

router.get('/all-courses', async (req, res) => {
    try {
        let courses = await Course.find().populate("teacher");

        let response = {
            success: true,
            msg: "All Courses Data",
            payload: {
                courses: courses.filter( course => course.status === "LIVE")
            }
        }
        return res.status(200).json(response);
    } catch (err) {
        let response = {
            success: false,
            msg: "Server error",
            details: "An unexpected error occured while getting all courses",
            err
        }
        return res.status(500).json(response);
    }
})

//@route    GET api/resource/courses/titleId
//@desc     Get MyAccount Resource
//@access   private

router.get('/courses/:titleId', async (req, res) => {
    try {
        
        const {
            titleId
        } = req.params;

        let course = await Course.findOne({titleId}).populate('teacher lessons.lesson');

        if (!course) {
            let response = {
                success: false,
                msg: "Invalid Course Id",
                details: "No course found against the provided title id"
            }
            return res.status(400).json(response);
        }

        let accesslevel = "Preview";

        if (req.isAuthenticated()) {
            accesslevel = "Freeview";
            let student = req.user;
        }

        let response = {
            success: true,
            msg: "All Courses Data",
            payload: {
                course,
                accesslevel
            }
        }
        return res.status(200).json(response);
    } catch (err) {
        let response = {
            success: false,
            msg: "Server error",
            details: "An unexpected error occured while getting all courses",
            err
        }
        return res.status(500).json(response);
    }
})

module.exports = router;