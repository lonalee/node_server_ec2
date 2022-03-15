// 
const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')

/**
 * @description Show add page
 * @routes GET /stories/add 
 */

router.get('/add', ensureAuth, (req,res) => {
    res.render('stories/add')
})

/**
 * @description Process add form
 * @routes POST /stories 
 */

router.post('/', ensureAuth, async (req,res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

module.exports = router