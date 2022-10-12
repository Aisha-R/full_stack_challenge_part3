const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

morgan.token('body', (request, response) => JSON.stringify(request.body) )

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`Phonebook has info for ${persons.length} people ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    
    persons = persons.filter(person => person.id !== id)

    response.status(402).end()
})

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body

    if (name && number) {

        const found = persons.find(person => person.name === name)

        if (found) {
            response.status(403).end({ error: "name must be unique"})
        }

        const ids = persons.map(person => person.id)

        let id = Math.floor(Math.random() * (100 - 1) + 1)

        while (ids.includes(id)) {
            id = Math.floor(Math.random() * (100 - 1) + 1)
        }

        const person = { id, name, number }

        persons = persons.concat(person)

        response.json(person)
    } else {
        response.status(400).end({ error: "name and/or number missing" })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})