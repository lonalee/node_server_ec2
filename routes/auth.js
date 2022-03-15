// 
const express = require('express')
const router = express.Router()
const passport = require('passport')
/**
 * @description Authenticate with Google
 * @routes GET /auth/google
 */

router.get('/google', passport.authenticate('google', { scope: [ 'profile' ]}))

/**
 * @description Google auth callback
 * @routes GET /auth/google/callback
 */

router.get('/google/callback', passport.authenticate(
    "google", {
        failureRedirect: '/'
    }
), (req, res) => res.redirect('/dashboard'))

/**
 * @description logout user
 * @route /auth/logout
 */
router.get('/logout', (req,res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router