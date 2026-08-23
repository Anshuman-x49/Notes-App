import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const fetchNotes = async () => {
  const response = await api.get('/getnotes')
  return response.data.allNotes
}

export const createNoteApi = async (noteData) => {
  const response = await api.post('/addnote', noteData)
  return response.data.newNote
}

export const updateNoteApi = async (id, noteData) => {
  const response = await api.put(`/updatenote/${id}`, noteData)
  return response.data.updatedNote
}

export const deleteNoteApi = async (id) => {
  const response = await api.delete(`/deletenote/${id}`)
  return response.data
}

export default api
