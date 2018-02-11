const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())

morgan.token('data', function(request, response) {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(formatPerson))
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(persons => {
      response.json(persons.map(formatPerson))
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  Person
    .findById(request.params.id)
    .remove()
    .then(persons => {
      response.status(204).end()
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if(body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(formatPerson(person))
    })
})

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
