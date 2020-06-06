const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const Student = require('../../models/student');

const strategy = new LocalStrategy({usernameField: "email"}, (username, password, done) => {
    try {
      Student.findOne({ email: username }, (err, student) => {
        if (err) { return done(err); console.log(err)}

        //Match Student
        if (!student) {
          return done(null, false, { message: 'Incorrect email.' });
        }

        //Match Password
        bcrypt.compare(password, student.local.password, (err, isMatch) => {
          if (err) throw err;
          if(isMatch) {
            return done(null, student);
          } else {
            return done(null, false, { message: 'Incorrect password.' });
          }
        });

      });
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = strategy