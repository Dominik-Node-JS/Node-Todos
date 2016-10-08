'use strict'
let db = require('../data/db')
let fs = require('fs')
let path = require('path')
exports.renderCreate = (req, res) => {
  res.render('create')
}

exports.createTodo = (req, res) => {
  req.pipe(req.busboy)
  let todo = {}
  let badUserInputDetected = false
  badUserInputDetected = false

  req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    filename = new Date().getTime() + filename
    let saveTo = path.join(__dirname, '/../images/' + filename)
    todo.image = filename
    file.pipe(fs.createWriteStream(saveTo))
  })

  req.busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
    if (val) {
      todo[fieldname] = val
      todo.state = 'Pending'
    } else {
      badUserInputDetected = true
    }
  })

  req.busboy.on('finish', () => {
    if (badUserInputDetected === true) {
      res.status(400).send('Bad user input')
    } else {
      db.add(todo)
      res.redirect('/')
    }
  })
}

exports.getAll = (req, res) => {
  db.seed()
  let sortedTodos = db.getAll().sort((t1, t2) => {
    if (t1.state < t2.state) return -1
    if (t1.state > t2.state) return 1
    return 0
  })
  let todos = {
    allTodos: sortedTodos
  }
  res.render('all-todos', todos)
}

exports.details = (req, res) => {
  let todo = db.getById(req.params.id)
  res.render('todo-details', {todo: todo})
}

exports.changeState = (req, res) => {
  let todo = db.getById(req.params.id)
  todo.state = todo.state.toLowerCase() === 'done' ? 'Pending' : 'Done'
  db.update(req.params.id, todo)
  res.redirect('/details/' + todo.id)
}

exports.addComment = (req, res) => {
  let todo = db.getById(req.params.id)
  req.pipe(req.busboy)

  let badUserInputDetected = false
  req.busboy.on('field', (fieldname, comment, fieldnameTruncated, valTruncated) => {
    if (comment) {
      todo.comments.push(comment)
      todo.commentedAt = new Date().toLocaleString()
    } else {
      badUserInputDetected = true
    }
  })

  req.busboy.on('finish', () => {
    if (badUserInputDetected === true) {
      res.status(400).send('Bad user input')
    } else {
      db.update(req.params.id, todo)
      res.redirect('/details/' + todo.id)
    }
  })
}

exports.listComments = (req, res) => {
  let todo = db.getById(req.params.id)
  res.render('todo-comments', {comments: todo.comments})
}
