const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())

morgan.token('data', function(request, response) {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const numberOfPersons = persons.length
  const date = new Date().toString()
  response.send(`
    <div>
      puhelinluettelossa ${numberOfPersons} henkilön tiedot
    </div>
    <div>
      ${date} 
    </div>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if(body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  if(persons.some(person => person.name === body.name)) {
    return response.status(400).json({ error: 'name already exists' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  response.json(person)
})

const generateId = () => {
  return Math.floor(Math.random() * 9999999)
}

const port = 3001
app.listen(port, () => {
  console.log('Server running on port', port)
})
