// 
const express = require('express')
const router = express.Router()

/**
 * @description Landing
 * @routes GET / 
 */

router.get('/', (req,res) => {
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

router.get('/dashboard', (req,res) => {
    res.render('dashboard')
})

module.exports = router