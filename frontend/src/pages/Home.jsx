import { useEffect, useMemo, useState } from 'react'
import NoteCard from '../components/NoteCard'
import AddNoteModal from '../components/AddNoteModal'
import { fetchNotes, createNoteApi, updateNoteApi, deleteNoteApi } from '../api/notesApi'

const Home = () => {
  const [notes, setNotes] = useState([])
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isBackendConnected, setIsBackendConnected] = useState(true)

  // Modal state for Add Note Form (React Hook Form)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)

  // Fetch notes from backend on mount
  useEffect(() => {
    loadNotesFromApi()
  }, [])

  const loadNotesFromApi = async () => {
    setLoading(true)
    try {
      const apiNotes = await fetchNotes()
      if (Array.isArray(apiNotes) && apiNotes.length > 0) {
        setNotes(apiNotes)
        setActiveNoteId(apiNotes[0]._id)
      } else {
        setNotes([])
        setActiveNoteId(null)
      }
      setIsBackendConnected(true)
    } catch (err) {
      console.warn("Backend API not reachable, using empty local state:", err)
      setIsBackendConnected(false)
      setNotes([])
      setActiveNoteId(null)
    } finally {
      setLoading(false)
    }
  }

  const activeNote = notes.find((note) => note._id === activeNoteId) ?? notes[0]

  const visibleNotes = useMemo(
    () => notes.filter((note) =>
      (note.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (note.description || '').toLowerCase().includes(search.toLowerCase())
    ),
    [notes, search]
  )

  // Callback called by AddNoteModal when React Hook Form submits valid data
  const handleAddNoteSubmit = async (formData) => {
    setIsSubmittingNote(true)
    try {
      const newNote = await createNoteApi({
        title: formData.title,
        description: formData.description
      })
      setNotes((currentNotes) => [newNote, ...currentNotes])
      setActiveNoteId(newNote._id)
    } catch (err) {
      console.warn("Failed to create note on backend, creating locally:", err)
      const newId = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      const localNote = {
        _id: newId,
        title: formData.title,
        description: formData.description,
        __v: 0
      }
      setNotes((currentNotes) => [localNote, ...currentNotes])
      setActiveNoteId(newId)
    } finally {
      setIsSubmittingNote(false)
    }
  }

  const deleteNote = async (idToDelete) => {
    setNotes((currentNotes) => {
      const updatedNotes = currentNotes.filter((n) => n._id !== idToDelete)
      if (activeNoteId === idToDelete) {
        setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0]._id : null)
      }
      return updatedNotes
    })

    try {
      await deleteNoteApi(idToDelete)
    } catch (err) {
      console.warn("Could not delete note from server:", err)
    }
  }

  const updateActiveNoteTitle = (title) => {
    if (!activeNote) return
    const updated = { ...activeNote, title }
    setNotes((currentNotes) => currentNotes.map((n) => (n._id === activeNote._id ? updated : n)))

    // Save to API
    syncNoteToBackend(activeNote._id, updated.title, updated.description)
  }

  const updateActiveNoteDescription = (description) => {
    if (!activeNote) return
    const updated = { ...activeNote, description }
    setNotes((currentNotes) => currentNotes.map((n) => (n._id === activeNote._id ? updated : n)))

    // Save to API
    syncNoteToBackend(activeNote._id, updated.title, updated.description)
  }

  const syncNoteToBackend = async (id, title, description) => {
    try {
      await updateNoteApi(id, { title, description })
    } catch (err) {
      console.warn("Sync failed for note update:", err)
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:grid md:grid-cols-[230px_340px_minmax(0,1fr)] bg-[#f4f1eb] font-serif">
      {/* Add Note Modal Component (React Hook Form) */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddNote={handleAddNoteSubmit}
        isSubmitting={isSubmittingNote}
      />

      {/* Sidebar */}
      <aside className="bg-[#293b38] text-[#f7f4ed] p-6 flex flex-col justify-between md:min-h-screen">
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xl font-bold tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-[#e5b46a] text-[#293b38] font-bold text-lg flex items-center justify-center shadow-xs">
                N
              </div>
              <span>Notely</span>
            </div>
            <button
              onClick={loadNotesFromApi}
              title="Refresh notes from server"
              className="text-[#9daea6] hover:text-white text-xs font-sans p-1 transition-colors"
            >
              🔄
            </button>
          </div>

          {/* New Note Button -> Opens React Hook Form Modal */}
          <button
            className="w-full mt-8 py-3 px-4 rounded-lg bg-[#e5b46a] hover:bg-[#d9a557] active:scale-[0.98] text-[#293b38] font-sans font-bold text-sm flex items-center justify-start gap-2 transition-all shadow-sm"
            onClick={() => setIsAddModalOpen(true)}
            type="button"
          >
            <span className="text-xl leading-none" aria-hidden="true">+</span> New note
          </button>

          {/* Navigation */}
          <nav className="mt-8 flex flex-row md:flex-col gap-1 font-sans text-xs font-medium" aria-label="Note views">
            <a
              className="flex-1 md:flex-initial flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#38504b] text-white shadow-xs"
              href="#all-notes"
            >
              All notes <span className="text-[#e5b46a] font-semibold">{notes.length}</span>
            </a>
            <a
              className="flex-1 md:flex-initial flex items-center justify-between px-3 py-2.5 rounded-lg text-[#b7c4bd] hover:bg-[#38504b]/50 hover:text-white transition-colors"
              href="#favorites"
            >
              Favorites
            </a>
            <a
              className="flex-1 md:flex-initial flex items-center justify-between px-3 py-2.5 rounded-lg text-[#b7c4bd] hover:bg-[#38504b]/50 hover:text-white transition-colors"
              href="#archive"
            >
              Archive
            </a>
          </nav>
        </div>

        {/* Footer status */}
        <div className="hidden md:flex items-center gap-2 text-xs font-sans text-[#9daea6] pt-6 border-t border-[#38504b]/60">
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {isBackendConnected ? 'Connected to API' : 'Offline / Local Mode'}
        </div>
      </aside>

      {/* Notes List Column */}
      <section className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#ddd8cf] flex flex-col gap-5 overflow-y-auto" id="all-notes">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a26846] mb-1">
              Your space
            </p>
            <h1 className="text-3xl font-serif text-[#263532] tracking-tight">All notes</h1>
          </div>
          <span className="text-xs font-sans text-[#8c928d] bg-stone-200/60 px-2.5 py-1 rounded-full">
            {notes.length} notes
          </span>
        </div>

        {/* Search Bar */}
        <label className="relative flex items-center bg-[#fbfaf7] border border-[#d9d4cb] focus-within:border-[#a26846] focus-within:ring-2 focus-within:ring-[#a26846]/20 rounded-lg px-3 py-2.5 transition-all shadow-2xs">
          <span className="text-stone-400 font-mono text-sm mr-2.5" aria-hidden="true">/</span>
          <input
            className="w-full bg-transparent font-sans text-xs text-[#29312f] placeholder-stone-400 outline-none"
            aria-label="Search notes"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notes..."
            type="search"
            value={search}
          />
        </label>

        {/* Note Cards */}
        <div className="flex flex-col gap-2 mt-2">
          {loading ? (
            <p className="p-6 text-center text-xs font-sans text-stone-500 bg-stone-100/50 rounded-xl animate-pulse">
              Loading notes from server...
            </p>
          ) : visibleNotes.length > 0 ? (
            visibleNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                isSelected={note._id === activeNoteId}
                onClick={() => setActiveNoteId(note._id)}
                onDelete={deleteNote}
              />
            ))
          ) : (
            <div className="p-6 text-center text-xs font-sans text-stone-500 bg-stone-100/50 rounded-xl space-y-2">
              <p>No matching notes found.</p>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="text-[#a26846] font-semibold underline hover:text-[#8a5537]"
              >
                Create your first note
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Note Editor Column */}
      <section className="bg-[#fbfaf7] p-6 md:p-12 min-h-125 flex flex-col justify-between" aria-label="Note editor">
        <div>
          <div className="flex items-center justify-between pb-6 text-xs font-sans text-stone-400 uppercase tracking-wider">
            <span>Editing note</span>
            <button
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-md transition-colors font-mono text-sm"
              aria-label="More note options"
              type="button"
            >
              ...
            </button>
          </div>

          {activeNote ? (
            <div className="max-w-2xl mx-auto w-full space-y-6 pt-4">
              <input
                className="w-full text-3xl md:text-5xl font-serif text-[#29312f] bg-transparent outline-none border-b border-transparent focus:border-stone-200 placeholder-stone-300 pb-2 transition-colors"
                onChange={(event) => updateActiveNoteTitle(event.target.value)}
                placeholder="Note title..."
                value={activeNote.title || ''}
              />

              <div className="flex items-center gap-3 font-sans text-xs">
                <span className="font-mono text-stone-600 bg-stone-200/70 px-2.5 py-1 rounded-lg border border-stone-300/40">
                  ID: {activeNote._id}
                </span>
                <span className="font-semibold text-[#a26846] bg-[#f2e4d5] px-2.5 py-1 rounded-lg">
                  v{activeNote.__v ?? 0}
                </span>
              </div>

              <textarea
                aria-label="Note description"
                className="w-full min-h-87.5 text-lg font-serif text-[#29312f] bg-transparent outline-none resize-none placeholder-stone-300 leading-relaxed pt-2"
                onChange={(event) => updateActiveNoteDescription(event.target.value)}
                placeholder="Write your note description here..."
                value={activeNote.description || ''}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-75 text-stone-400 font-sans text-sm gap-3">
              <p>No note selected.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                type="button"
                className="px-4 py-2 bg-[#e5b46a] text-[#293b38] font-bold rounded-lg text-xs hover:bg-[#d9a557] transition-all"
              >
                + Add New Note
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Home
