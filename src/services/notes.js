import axios from "axios";
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const update = (id, updatedPerson) => {
    const url = `${baseUrl}/${id}`;
    return axios.put(url, updatedPerson);
  }

const deletePerson =(id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    getAll: getAll,
    create:create,
    update: update,
    deletePerson: deletePerson
}