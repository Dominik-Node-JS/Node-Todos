'use strict'
let db = require('../data/db')

exports.getStats = (req, res) => {
  let headerName = 'My-Authorization'
  if (req.get(headerName) === 'Admin') {
    let allTodos = db.getAll()
    var totalNumberOfTodos = allTodos.length ? allTodos.length : 0
    var commentsCount = 0
    for (let i = 0; i < allTodos.length; i++) {
      let todo = allTodos[i]
      commentsCount += todo.comments ? todo.comments.length : 0
    }
    var data = {
      todosCount: totalNumberOfTodos,
      commentsCount: commentsCount
    }

    res.render('stats', data)
  } else {
    res.status(404).send('Not Found')
  }
}
