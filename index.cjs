const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const Person = require('./models/mongo.cjs');

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:', request.path);
  console.log('Body:', request.body);
  console.log('---');
  next();
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log('QUERY RESULTS:', persons.length);
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.error('Error fetching person by id:', error);
      response.status(400).json({ error: 'Internal Server Error' });
    });
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name and number are required' })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => {
      console.error('Error saving person:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    });
})

app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const body = request.body;

  Person.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => {
      console.error('Error updating person:', error);
      response.status(400).json({ error: 'Invalid data or person not found' });
    });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => {
      console.error('Error deleting person:', error);
      response.status(400).json({ error: 'Person not found' });
    });
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' });
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
