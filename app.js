const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

// Load config
dotenv.config({
    path: './config/config.env'
})

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars helpers
const { formatDate, truncate, stripTags, editIcon,select } = require('./helper/hbs')

// handlebars - template engine : 마크업에 사용될 템플릿 처리
app.engine('.hbs', exphbs.engine({ helpers: 
    { formatDate, truncate, stripTags, editIcon, select }, defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// session (express-session)
app.use(session({
    secret: 'pen2mars', //random strings
    resave: false, // 수정된 것이 없다면 세션을 저장하지 않음
    saveUninitialized: false, // 저장된 것이 없다면 세션을 생성하지 않음
    store: MongoStore.create({
        // mongooseConnection: mongoose.connection
        mongoUrl: process.env.MONGO_URI
    })
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

// static folder
app.use(express.static(path.join(__dirname, 'public')))
/**
 * @description __dirname : absolute current directory
 */

// ROUTES
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3002

app.listen(PORT, console.log(`in ${process.env.NODE_ENV} on port: ${process.env.PORT}`))