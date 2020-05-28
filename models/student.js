const mongoose = require('mongoose');

// Define the model
const Schema = new mongoose.Schema({
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    payments: [{
        txnid: String,
        amount: Number,
        date: Date,
        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'Course',
            required: true
        },
        isRefunded: {
            type: Boolean,
            default: false
        }
    }]
})


// Export the model
module.exports = mongoose.model('Student', Schema);
