const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Student = require('../../models/student');
require('dotenv').config();

const strategy = new GoogleStrategy(
    {
        clientID        : process.env.GOOGLE_CLIENT_ID,
        clientSecret    : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL     : process.env.GOOGLE_CALLBACK_URL
    },
    (token, refreshToken, profile, done) => {
        try {
            process.nextTick(async () => {
                let student = await Student.findOne({email: profile.emails[0].value});
                if (student) {
                    return done(null, user);
                } else {
                    student = new Student({
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        google: {
                            id: profile.id,
                            token
                        }
                    })
                    await student.save();
                    return done(null, student);
                }
            })   
        } catch (err) {
            return done(err);
        }
    }
)

module.exports = strategy;