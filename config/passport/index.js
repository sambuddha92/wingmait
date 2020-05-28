const passport = require('passport');
const Student = require('../../models/student');
const GoogleStrategy = require('./googleStrategy');

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((student, done) => {
	done(null, student.id);
})

// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
	Student.findById(id, (err, student) => { done(err, student) } )
})

//  Use Strategies 
passport.use(GoogleStrategy);

module.exports = passport;