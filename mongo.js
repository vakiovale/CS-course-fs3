const mongoose = require('mongoose')

const url = 'mongodb://user:<passwd>@ds113136.mlab.com:13136/cs-course-fullstack-persons'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

let name = process.argv[2]
let number = process.argv[3] 


if(name !== undefined && number !== undefined) {
  const person = new Person({
    name: name,
    number: number 
  })

  person
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)
      mongoose.connection.close()
    })
} else {
  console.log('puhelinluettelo:')
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}

