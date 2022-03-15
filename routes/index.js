// 
const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')

/**
 * @description Landing
 * @routes GET / 
 */

router.get('/', ensureGuest, (req,res) => {
    res.render('login', {
        layout: 'login'
    })
/**
 * @description res.send 메소드는 text를 리턴함. render로 템플릿을 리턴
*/ 
})

/**
 * @description Dashboard
 * @routes GET /dashboard 
 */

router.get('/dashboard', ensureAuth, async (req,res) => {
    console.log('*** routes to dashboard *** req :', req.user)
    try {
        const stories = await Story.find({
            user: req.user.id
        }).lean()
        console.log('*** routes to dashboard *** stories :', stories)
        res.render('dashboard', {
            name: req.user.displayName,
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

module.exports = router