const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')

//Load config
dotenv.config({
    path: './config/config.env'
})

connectDB()

const app = express();

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// handlebars - template engine : 마크업에 사용될 템플릿 처리
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// static folder
app.use(express.static(path.join(__dirname, 'public')))
/**
 * @description __dirname : absolute current directory
 */

// ROUTES
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 3002

app.listen(PORT, console.log(`in ${process.env.NODE_ENV} on port: ${process.env.PORT}`))