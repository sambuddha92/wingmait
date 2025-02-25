const mongoose = require('mongoose');

// Define the model
const Schema = new mongoose.Schema({
    email: String,
    name: String,
    local: {
        password: String,
        token: String
    },
    google: {
        id: String,
        token: String
    },
    facebook: {
        id: String,
        token: String
    },
    linkedin: {
        id: String,
        token: String
    },
    twitter: {
        id: String,
        token: String
    },
    payments: [{
        txnid: String,
        amount: Number,
        date: Date,
        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course'
        },
        isRefunded: {
            type: Boolean,
            default: false
        }
    }],
    enrolments: [{
        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course'
        }
    }]
})


// Export the model
module.exports = mongoose.model('Student', Schema);
