const express = require('express');
const cors = require('cors');
const app = express();
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---');
  next();
}

app.use(cors());
app.use(express.json());
app.use(requestLogger);

let phonebook = [
  {
    "name": "Sabhyaa",
    "number": "9803297276",
    "id": 1
  },
  {
    "name": "hjvwfjvcw",
    "number": "",
    "id": 2
  },
  {
    "name": "posjvojsvjsiv",
    "number": "",
    "id": 3
  },
  {
    "name": "",
    "number": "",
    "id": 4
  },
  {
    "name": "sabhyaa",
    "number": "",
    "id": 5
  }
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name and number are required' });
  }

  const nameExists = phonebook.some(person => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({ error: 'Name already exists in the phonebook' });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000000) + 1
  };

  phonebook = phonebook.concat(newPerson);

  response.json(newPerson);
});

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;

  const personIndex = phonebook.findIndex(person => person.id === id);

  if (personIndex !== -1) {
    phonebook[personIndex] = { ...phonebook[personIndex], ...body };
    response.json(phonebook[personIndex]);
  } else {
    response.status(404).json({ error: 'Person not found' });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter(person => person.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
