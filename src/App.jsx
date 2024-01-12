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
      return;
    }
  
    if (nameExists) {
      const existingPerson = persons.find(person => person.name === newName);
      const confirmed = window.confirm(`${existingPerson.name} already exists in the phonebook with ${existingPerson.number}. Do you want to change the number to ${newNumber}`);
  
      if (confirmed) {
        axios
          .put(`http://localhost:3001/api/persons/${existingPerson.id}`, newPerson)
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
      const newId = Math.max(...persons.map(person => person.id), 0) + 1;
      axios
        .post('http://localhost:3001/api/persons', { ...newPerson, id: newId })
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
  };

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
