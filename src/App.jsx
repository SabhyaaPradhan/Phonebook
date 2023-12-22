import React, { useState } from "react";
import Note from './components/Note'

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]);
  const [newName, setNewName] = useState('');

  const addPerson = (event) => {
    event.preventDefault();

    // Create a new person object with the entered name
    const newPerson = { name: newName };

    // Update the state with the new person
    setPersons([...persons, newPerson]);

    // Clear the input field
    setNewName('');
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name : <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person, index) => (
          <Note key={index} person={person} />
        ))}
      </ul>
    </div>
  );
};

export default App;
