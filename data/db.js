'use strict'
let todosDb = []
let idIncrement = 1

exports.seed = () => {
  if (todosDb.length > 0) {
    return
  }
  console.log('Seeding database...')
  for (let i = 0; i < 5; i++) {
    let todo = {
      id: idIncrement++,
      title: 'Test' + i,
      description: 'Test desc' + i,
      state: 'Done',
      comments: []
    }
    todosDb.push(todo)
  }
}

exports.getAll = () => {
  return todosDb
}

exports.add = (todo) => {
  todo.id = idIncrement++
  todo.comments = []
  todosDb.push(todo)
}

exports.getById = (id) => {
  var entity = todosDb.filter(function (a) {
    return a.id === parseInt(id)
  })
  return entity[0]
}

exports.delete = (id) => {
  todosDb.slice(id, 1)
}

exports.update = (id, todo) => {
  // dirty solution
  if (id === '1') {
    todosDb[0] = todo
  } else {
    todosDb[id] = todo
  }
}
