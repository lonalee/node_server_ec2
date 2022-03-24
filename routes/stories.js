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

/**
 * @description Show all public stories
 * @routes GET /stories 
 */

router.get('/', ensureAuth, async (req,res) => {
    try {
        // public status인 데이터를 찾기
        const stories = await Story.find({ status: 'public'})
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('stories/index', {
            stories
        })

    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

/**
 * @description Show edit page
 * @routes GET /stories/edit/:id 
 */

 router.get('/edit/:id', ensureAuth, async (req,res) => {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()

    if(!story) {
        return res.render('error/404')
    }


    if(story.user != req.user.id) {
        // !== 비교를 하면 new ObjectId 형식과 비교할 수 없음??
        res.redirect('/stories')
    } else {
        res.render('stories/edit', {
            story
        })
    }


})

module.exports = router