const express =require('express');
const router = express.Router();
const passport = require('../config/passport');

//@route    GET api/auth
//@desc     Authenticate Request
//@access   private

router.get( '/', (req, res) => {
    try {

        if (req.isAuthenticated()) {
            
            let response = {
                success: true,
                msg: "User Authenticated"
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
            details: "An unexpected error occured while trying to authenticate user",
            error: err
        }
    
          return res.status(500).json(response);
    }
} )

//@route    GET api/auth/google
//@desc     Login User Using Google Strategy
//@access   public

router.get( '/google', passport.authenticate('google', { scope : ['profile', 'email'] }), (req, res) => {

    let response = {
        success: true,
        msg: "Logged In",
        payload: {
            permission: req.student
        }
      }

    return res.status(200).json(response);
});

//@route    GET api/auth/google
//@desc     Login User Using Google Strategy
//@access   public

router.get( '/google/callback', passport.authenticate('google'), (req, res) => {

    let response = {
        success: true,
        msg: "Logged In",
        payload: {
            permission: req.student
        }
      }

    return res.status(200).json(response);
});

//@route    POST api/auth/logout
//@desc     Logout User
//@access   private

router.get( '/logout', (req, res) => {
    
    try {
        req.logOut();
        let response = {
            success: true,
            msg: "Logged Out"
        }
        return res.status(200).json(response);    
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

module.exports = router;