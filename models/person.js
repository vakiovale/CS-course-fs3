const mongoose = require('mongoose')

const url = 'mongodb://user:<passwd>@ds113136.mlab.com:13136/cs-course-fullstack-persons'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.statics.format = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person
