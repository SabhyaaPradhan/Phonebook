import React, { useState, useEffect } from "react";
import noteService from './services/notes';

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')


  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.some(person => person.name === newName);

    if (nameExists) {
      const existingPerson = persons.find(person => person.name === newName);
      window.alert(`${existingPerson.name} already exists in the phonebook with ${existingPerson.number}`);
    
    } else {
      const newPerson = { name: newName, number: newNumber }

      noteService
        .create(newPerson)
        .then(response => {
          setPersons([...persons, response.data])
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.error('Error adding person:', error);
        })
    }
  }

  const deletePerson = (id, name) => {
    const confirmed = window.confirm(`Delete ${name} from the phonebook?`);
    if (confirmed) {
      noteService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error('Error deleting person:', error);
        })
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.number.includes(searchQuery)
  )

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

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
  )
}

export default App