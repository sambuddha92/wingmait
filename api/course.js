const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
require('dotenv').config();

let s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1',
    signatureVersion: 'v4'
});

const s3Bucket = 'wingmait-course';

const Course = require('../models/course.js');
const Teacher = require('../models/teacher.js');
const Lesson = require('../models/lesson.js');

//@route    GET api/course/all
//@desc     Get All Courses
//@access   public

router.get('/all', async (req, res) => {
    try {
        const courses = await Course.find().populate('teacher');

        let response = {
            success: true,
            msg: "All Courses",
            payload: courses
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

//@route    GET api/course/id
//@desc     Get A Course
//@access   public

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findOne({titleId: id}).populate('teacher lessons.lesson');

        let response = {
            success: true,
            msg: "Course",
            payload: course
        }

        return res.status(200).json(response);

    } catch (err) {
        let response = {
            success: false,
            msg: "Server Error",
            details: "An unexpected error occured while getting a courses",
            error: err
        }
        return res.status(500).json(response);
    }
})

module.exports = router;