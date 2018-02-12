const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())

morgan.token('data', function(request) {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

app.get('/info', (request, response) => {
  Person.count({}, function(error, count) {
    const date = new Date().toString()
    response.send(`
      <div>
        puhelinluettelossa ${count} henkilön tiedot
      </div>
      <div>
        ${date} 
      </div>
    `)
  })
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(Person.format))
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(() => {
      response.status(400).end()
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  if(body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if(body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).end()
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

  Person
    .find({ name: person.name })
    .then(samePerson => {
      if(samePerson.length > 0) {
        throw new Error()
      }
    })
    .then(() => {
      person
        .save()
        .then(() => {
          return response.json(Person.format(person))
        })
    })
    .catch(() => {
      return response.status(400).json({ error: 'name exists' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})