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
    try {
    res.render('stories/add')
    } catch (error) {
        console.error(error)
        return res.render('error/500')        
    }
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
 * @description Show a page
 * @routes GET /stories/:id 
 */

 router.get('/:id', ensureAuth, async(req,res) => {
    try {
        let story = await Story.findById(req.params.id).populate('user').lean()

        if(!story) {
            return res.render('error/404')
        }
        console.log('check story', story)
        res.render('stories/show', story)
    } catch (error) {
      console.error(error)
      return res.render('error/404')        
    }
})

/**
 * @description Show edit page
 * @routes GET /stories/edit/:id 
 */

 router.get('/edit/:id', ensureAuth, async (req,res) => {
     try {
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
    } catch (error) {
        console.error(error)
        return res.render('error/500')            
    }

})

/**
 * @description Update story
 * @routes PUT /stories/:id 
 */

 router.put('/:id', ensureAuth, async(req,res) => {
     try {
    let story = await Story.findById(req.params.id).lean()
    if(!story) {
        return res.render('error.404')
    }

    if(story.user != req.user.id) {
        // !== 비교를 하면 new ObjectId 형식과 비교할 수 없음??
        res.redirect('/stories')
    } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })

        res.redirect('/dashboard')
    }
} catch (error) {
    console.error(error)
    return res.render('error/500') 
}
})

/**
 * @description Delete story
 * @routes GET /stories/:id 
 */

 router.delete('/:id', ensureAuth, async(req,res) => {
    try {
        const stories = await Story.find()
        console.log('all stories', stories.length)
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
        const newstories = await Story.find()
        console.log('after deleting', newstories.length)
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
})

module.exports = router