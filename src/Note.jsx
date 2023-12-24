import React from "react";

const Note = ({ person }) => {
  return (
    <li>
      Name: {person.name}, Number: {person.number}
    </li>
  )
}

export default Note;