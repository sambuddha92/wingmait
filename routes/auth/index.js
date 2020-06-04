const express =require('express');
const router = express.Router();
const passport = require('../../config/passport');

//@route    GET auth/google
//@desc     Login User Using Google Strategy
//@access   public

router.get( '/google', passport.authenticate('google', { scope: ["profile", "email"] }));

//@route    GET auth/google/callback
//@desc     Google Login Callback
//@access   public

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});

//@route    GET auth/facebook
//@desc     Login User Using Facebook Strategy
//@access   public

router.get( '/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

//@route    GET auth/facebook/callback
//@desc     Facebook Login Callback
//@access   public

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});

module.exports = router;