import axios from 'axios'

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    'Content-Type': 'application/json'
  }
})

// GET all notes — GET /api/notes/get-notes
export const fetchNotes = async () => {
  const response = await api.get('/api/notes/get-notes')
  return response.data.data
}

// CREATE note — POST /api/notes/add-note
export const createNoteApi = async (noteData) => {
  const response = await api.post('/api/notes/add-note', noteData)
  return response.data.data
}

// UPDATE note — PUT /api/notes/update-note/:id
export const updateNoteApi = async (id, noteData) => {
  const response = await api.put(`/api/notes/update-note/${id}`, noteData)
  return response.data.data
}

// DELETE note — DELETE /api/notes/delete-note/:id
export const deleteNoteApi = async (id) => {
  const response = await api.delete(`/api/notes/delete-note/${id}`)
  return response.data
}

// TOGGLE favorite — PUT /api/notes/fav-note/:id
export const toggleFavoriteApi = async (id) => {
  const response = await api.put(`/api/notes/fav-note/${id}`)
  return response.data.data
}

export default api
