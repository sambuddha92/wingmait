const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('./config/passport');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();


//Initialize app
const app = express();

//Connect to DB
const connect = require('./config/db');
connect();

//Configure middleware
app.use( session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 43200000 }
}));
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );
app.use( cors({ credentials: true }) );

// Passport Config
app.use( passport.initialize() );
app.use( passport.session() );

//Define routes
app.use( '/api/resource', require('./routes/api/resource') );
app.use( '/api/student', require('./routes/api/student') );
app.use( '/api/course', require('./routes/api/course') );
app.use( '/api/lesson', require('./routes/api/lesson') );
app.use( '/api/interaction', require('./routes/api/interaction') );
app.use( '/auth', require('./routes/auth') );

app.use( '/robots.txt', function (req, res, next) {
  res.type('text/plain')
  res.sendFile(path.resolve(__dirname, 'client', 'robots.txt'));
});

app.use( express.static(__dirname + '/client') );

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

//Set up Listening PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});