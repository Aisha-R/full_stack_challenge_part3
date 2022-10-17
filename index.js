require('dotenv').config()

const express = require('express')
const app = express()

const Person = require('./models/person')

const morgan = require('morgan')
morgan.token('body', (request, response) => JSON.stringify(request.body))

const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response, next) => {
    Person
        .find({})
        .then(people => response.json(people))
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    const date = new Date()
    Person
        .countDocuments({})
        .then(count => response.send(`Phonebook has info for ${count} people ${date}`))
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(person => response.json(person))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    const person = { name, number }

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body

    if (name && number) {

        const person = new Person({ name, number })

        person
            .save()
            .then(savedPerson => response.json(savedPerson))
            .catch(error => next(error))
    }

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})