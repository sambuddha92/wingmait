const FacebookStrategy = require('passport-facebook').Strategy;
const Student = require('../../models/student');
require('dotenv').config();

const strategy = new FacebookStrategy(
    {
        clientID        : process.env.FACEBOOK_CLIENT_ID,
        clientSecret    : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL     : process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'emails']
    },
    (token, refreshToken, profile, done) => {
        try {
            let email = profile.emails[0].value;
            let name = profile.displayName;
            let id = profile.id;
            process.nextTick(async () => {
                let student = await Student.findOne({email});
                if (student) {
                    return done(null, user);
                } else {
                    student = new Student({
                        email,
                        name,
                        facebook: {
                            id,
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