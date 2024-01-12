import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/persons',
});

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const addPerson = (event) => {
    event.preventDefault();

    const nameExists = persons.some(person => person.name === newName);
    const newPerson = { name: newName, number: newNumber };

    if (!newName || !newNumber) {
      console.error('Error adding person:', { error: 'Name and number are required' });
      alert('Name and number are required')
      return;
    }

    if (newName.length < 3) {
      console.error('Error adding person:', { error: 'Name must be at least 3 characters long' });
      alert('Name must be at least 3 characters long');
      return;
    }

    const phoneRegex = /^\d{2,3}-\d{7,}$/;

    if (!phoneRegex.test(newNumber)) {
      console.error('Error adding person:', { error: 'Invalid phone number format' });
      alert('Invalid phone number format. Please use the format like 09-1234556 or 040-22334455');
      return;
    }

    if (nameExists) {
      const existingPerson = persons.find(person => person.name === newName);
      const confirmed = window.confirm(`${existingPerson.name} already exists in the phonebook with ${existingPerson.number}. Do you want to change the number to ${newNumber}`);

      if (confirmed) {
        api.put(`/${existingPerson.id}`, newPerson)
          .then(response => {
            console.log('Person updated successfully:', response.data);
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            console.error('Error updating person:', error.response ? error.response.data : error.message);
          });
      }
    } else {
      api.post('/', newPerson)
        .then(response => {
          console.log('Person added successfully:', response.data);
          setPersons([...persons, response.data]);
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          console.error('Error adding person:', error.response ? error.response.data : error.message);
        });
    }
  };

  const deletePerson = (id, name) => {
    const confirmed = window.confirm(`Delete ${name} from the phonebook?`);
    if (confirmed) {
      api.delete(`/${id}`)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error('Error deleting person:', error);
        });
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.number.includes(searchQuery)
  );

  useEffect(() => {
    api.get('/')
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Phonebook</h1>
      <div>
        Search: <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <h2>Add new person</h2>
      <form onSubmit={addPerson}>
        <div>
          name : <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          number : <input
            type="text"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map((person, index) => (
          <li key={index}>{person.name}: {person.number}
            <button onClick={() => deletePerson(person.id, person.name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
