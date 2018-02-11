const mongoose = require('mongoose')

const url = 'mongodb://user:<passwd>@ds113136.mlab.com:13136/cs-course-fullstack-persons'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person
