const express =require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const passport = require('../../config/passport');

//@route    GET auth
//@desc     Facebook Login Callback
//@access   public

router.get('/', (req, res) => {
    try {
        if (req.isAuthenticated()) {
            let response ={
                success: true,
                msg: "Authorized"
            }
            return res.status(200).json(response);
        } else {
            let response = {
                success: false,
                msg: "Unauthorized"
            }
            return res.status(401).json(response);
        }
    } catch (err) {
        let response = {
            success: false,
            msg: "Server Error",
            err
        }
        return res.status(500).json(response);
    }
});

//@route    GET auth/ping
//@desc     Auth Ping
//@access   public

router.get('/ping', (req, res) => {
    try {
        if (req.isAuthenticated()) {
            let response ={
                success: true,
                msg: "Authorized",
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
            return res.status(401).json(response);
        }
    } catch (err) {
        let response = {
            success: false,
            msg: "Server Error",
            err
        }
        return res.status(500).json(response);
    }
});

//@route    GET auth/logout
//@desc     LogOut User
//@access   public

router.get('/logout', (req, res) => {
    try {
        if (req.isAuthenticated()) {
            req.logOut();
            let response = {
                success: true,
                msg: "Logged Out"
            }
            return res.status(200).json(response); 
        } else {
            return res.status(200).redirect('/');
        }
    } catch (err) {
        let response = {
            success: false,
            msg: "Server Error",
            details: "An unexpected error occured while logging out user",
            error: err
        }
        return res.status(500).json(response);
    }
});

//@route    GET auth/google
//@desc     Login User Using Google Strategy
//@access   public

router.get( '/google', passport.authenticate('google', { scope: ["profile", "email"] }));

//@route    GET auth/google/callback
//@desc     Google Login Callback
//@access   public

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/my-wingmait');
});

//@route    GET auth/facebook
//@desc     Login User Using Facebook Strategy
//@access   public

router.get( '/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

//@route    GET auth/facebook/callback
//@desc     Facebook Login Callback
//@access   public

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/my-wingmait');
});

//@route    POST to auth/local
//@desc     Login User Using Local Strategy
//@access   public

router.post( '/local', [upload.none(), passport.authenticate('local')], (req, res) => {
    if (req.isAuthenticated()) {
        let payload = {
            name: req.user.name,
            payments: req.user.payments,
            enrolments: req.user.enrolments
        }
        let response ={
            success: true,
            msg: "Logged in",
            payload
        }
        return res.status(200).json(response);
    } else {
        let response ={
            success: false,
            msg: "Unauthorized"
        }
        return res.status(401).json(response);
    }
} );

module.exports = router;