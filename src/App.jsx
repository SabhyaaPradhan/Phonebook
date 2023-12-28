import React, { useState } from "react";
import Note from "./Note"

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Sabhyaa', number: '9054342312' }]);
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')
  

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.some(person => person.name === newName)

    if (nameExists) {
      const existingPerson = persons.find(person => person.name === newName);
      window.alert(`${existingPerson.name} already exists in the phonebook with number`);
    }
    else {
      const newPerson = { name: newName, number: newNumber }
      setPersons([...persons, newPerson])
      setNewName('')
      setNewNumber('')
      setError('')
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.number.includes(searchQuery)
  )

  return (
    <div>
      <h2>Phonebook</h2>
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
          <Note key={index} person={person} />
        ))}
      </ul>
    </div>
  )
}

export default App
