'use strict'
let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')
let favicon = require('serve-favicon')
let home = require('./routes/home')
let admin = require('./routes/admin')
let todo = require('./routes/todo')
let busboy = require('connect-busboy')

let app = express()
let port = process.environment.PORT || 1338

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(busboy({ immediate: true }))
app.use(favicon(path.join(__dirname, '/public/favicon.ico')))
app.use(express.static(path.join(__dirname, 'images')))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', home.index)
app.get('/todo', todo.renderCreate)
app.get('/all-todos', todo.getAll)
app.get('/details/:id', todo.details)
app.get('/details/:id/comments', todo.listComments)
app.get('/stats', admin.getStats)
app.post('/create-todo', todo.createTodo)
app.post('/change-todo-state/:id', todo.changeState)
app.post('/add-todo-comment/:id', todo.addComment)

app.listen(port, () => { console.log(`Starting server... Listening on port ${port}`) })
