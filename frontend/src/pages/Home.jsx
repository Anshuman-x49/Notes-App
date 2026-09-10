import { useEffect, useMemo, useState, useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Star } from 'lucide-react'
import NoteCard from '../components/NoteCard'
import AddNoteModal from '../components/AddNoteModal'
import Sidebar from '../components/Sidebar'
import { fetchNotes, createNoteApi, updateNoteApi, deleteNoteApi, toggleFavoriteApi } from '../api/notesApi'

const Home = () => {
  const { id: paramNoteId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [notes, setNotes] = useState([])
  const [activeNoteId, setActiveNoteId] = useState(paramNoteId || null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isBackendConnected, setIsBackendConnected] = useState(true)

  // Derive activeTab from route location pathname
  const activeTab = location.pathname.startsWith('/favorites') ? 'favorites' : 'all'

  // Modal state for Add Note Form (React Hook Form)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)

  const loadNotesFromApi = useCallback(async () => {
    setLoading(true)
    try {
      const apiNotes = await fetchNotes()
      if (Array.isArray(apiNotes) && apiNotes.length > 0) {
        setNotes(apiNotes)
        // If URL has note ID, select it; otherwise default to first note on desktop
        if (paramNoteId && apiNotes.some((n) => n._id === paramNoteId)) {
          setActiveNoteId(paramNoteId)
        } else {
          setActiveNoteId(apiNotes[0]._id)
        }
      } else {
        setNotes([])
        setActiveNoteId(null)
      }
      setIsBackendConnected(true)
    } catch (err) {
      console.warn("Backend API not reachable:", err)
      setIsBackendConnected(false)
      setNotes([])
      setActiveNoteId(null)
    } finally {
      setLoading(false)
    }
  }, [paramNoteId])

  // Fetch notes from backend on mount
  useEffect(() => {
    loadNotesFromApi()
  }, [loadNotesFromApi])

  // Sync activeNoteId when paramNoteId changes from URL
  useEffect(() => {
    if (paramNoteId) {
      setActiveNoteId(paramNoteId)
    }
  }, [paramNoteId])

  const activeNote = notes.find((note) => note._id === activeNoteId) ?? notes[0]
  const isMobileEditorOpen = Boolean(paramNoteId && activeNote)

  const favoritesCount = useMemo(
    () => notes.filter((n) => n.isFavorite).length,
    [notes]
  )

  const visibleNotes = useMemo(() => {
    const tabFiltered = activeTab === 'favorites'
      ? notes.filter((n) => n.isFavorite)
      : notes

    return tabFiltered.filter(
      (note) =>
        (note.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (note.description || '').toLowerCase().includes(search.toLowerCase())
    )
  }, [notes, activeTab, search])

  // Select note and sync with URL
  const handleSelectNote = (id) => {
    setActiveNoteId(id)
    navigate(`/note/${id}`)
  }

  // Callback called by AddNoteModal when React Hook Form submits valid data
  const handleAddNoteSubmit = async (formData) => {
    setIsSubmittingNote(true)
    try {
      const newNote = await createNoteApi({
        title: formData.title,
        description: formData.description
      })
      if (newNote?._id) {
        setNotes((currentNotes) => [newNote, ...currentNotes])
        handleSelectNote(newNote._id)
      }
    } catch (err) {
      console.error("Failed to create note on backend:", err)
    } finally {
      setIsSubmittingNote(false)
    }
  }

  const deleteNote = async (idToDelete) => {
    setNotes((currentNotes) => {
      const updatedNotes = currentNotes.filter((n) => n._id !== idToDelete)
      if (activeNoteId === idToDelete) {
        const nextId = updatedNotes.length > 0 ? updatedNotes[0]._id : null
        setActiveNoteId(nextId)
        if (nextId) {
          navigate(`/note/${nextId}`)
        } else {
          navigate('/')
        }
      }
      return updatedNotes
    })

    try {
      await deleteNoteApi(idToDelete)
    } catch (err) {
      console.warn("Could not delete note from server:", err)
    }
  }

  const toggleFavoriteNote = async (idToToggle) => {
    // Optimistic UI update
    setNotes((currentNotes) =>
      currentNotes.map((n) => {
        if (n._id === idToToggle) {
          return { ...n, isFavorite: !n.isFavorite }
        }
        return n
      })
    )

    try {
      const updatedNote = await toggleFavoriteApi(idToToggle)
      // Sync with server response
      setNotes((currentNotes) =>
        currentNotes.map((n) => (n._id === idToToggle ? updatedNote : n))
      )
    } catch (err) {
      console.warn("Failed to sync favorite status to server:", err)
      // Revert on failure
      setNotes((currentNotes) =>
        currentNotes.map((n) => {
          if (n._id === idToToggle) {
            return { ...n, isFavorite: !n.isFavorite }
          }
          return n
        })
      )
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
    <main className="h-screen max-h-screen overflow-hidden flex flex-col sm:grid sm:grid-cols-[230px_320px_minmax(0,1fr)] bg-[#f4f1eb] font-serif">
      {/* Add Note Modal Component (React Hook Form) */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddNote={handleAddNoteSubmit}
        isSubmitting={isSubmittingNote}
      />

      {/* Sidebar Component: 20vh only on phones (<640px), full height on tablets and desktops (sm+) */}
      <div className={isMobileEditorOpen ? 'hidden sm:block h-full' : 'block h-[20vh] sm:h-full'}>
        <Sidebar
          onRefresh={loadNotesFromApi}
          loading={loading}
          onNewNote={() => setIsAddModalOpen(true)}
          activeTab={activeTab}
          totalNotesCount={notes.length}
          favoritesCount={favoritesCount}
          isBackendConnected={isBackendConnected}
        />
      </div>

      {/* Notes List Column: 80vh only on phones (<640px), full height on tablets and desktops (sm+) */}
      <section
        className={`relative p-4 sm:p-6 md:p-8 border-b sm:border-b-0 sm:border-r border-[#ddd8cf] flex-col gap-4 sm:gap-5 h-[80vh] sm:h-full overflow-hidden ${
          isMobileEditorOpen ? 'hidden sm:flex' : 'flex'
        }`}
        id="all-notes"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#a26846] mb-1">
              Your space
            </p>
            <h1 className="text-3xl font-serif text-[#263532] tracking-tight">
              {activeTab === 'favorites' ? 'Favorites' : 'All notes'}
            </h1>
          </div>
          <span className="text-xs font-sans text-[#8c928d] bg-stone-200/60 px-2.5 py-1 rounded-full">
            {visibleNotes.length} {visibleNotes.length === 1 ? 'note' : 'notes'}
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

        {/* Note Cards with hidden scrollbar */}
        <div className="flex flex-col gap-2 mt-2 overflow-y-auto no-scrollbar pb-16">
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
                onClick={() => handleSelectNote(note._id)}
                onDelete={deleteNote}
                onToggleFavorite={toggleFavoriteNote}
              />
            ))
          ) : (
            <div className="p-6 text-center text-xs font-sans text-stone-500 bg-stone-100/50 rounded-xl space-y-2">
              <p>
                {activeTab === 'favorites'
                  ? 'No favorite notes yet. Click the star icon on any note to mark it as a favorite!'
                  : 'No matching notes found.'}
              </p>
              {activeTab === 'all' && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-[#a26846] font-semibold underline hover:text-[#8a5537]"
                >
                  Create your first note
                </button>
              )}
            </div>
          )}
        </div>

        {/* Gradient Fade Overlay at the bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#f4f1eb] via-[#f4f1eb]/80 to-transparent z-10" />
      </section>

      {/* Note Editor Column: Visible on phones only when note is open, full height side-by-side on tablets and desktops */}
      <section
        className={`h-full bg-[#fbfaf7] p-6 sm:p-8 md:p-12 flex-col justify-between overflow-y-auto no-scrollbar ${
          isMobileEditorOpen ? 'flex' : 'hidden sm:flex'
        }`}
        aria-label="Note editor"
      >
        <div>
          <div className="flex items-center justify-between pb-6 text-xs font-sans text-stone-400 uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(activeTab === 'favorites' ? '/favorites' : '/')}
                className="sm:hidden flex items-center gap-1 text-xs font-sans font-bold text-[#a26846] hover:text-[#8a5537] bg-[#f2e4d5] px-2.5 py-1 rounded-lg transition-colors mr-1 cursor-pointer"
              >
                ← Notes
              </button>
              Editing note
              {activeNote?.isFavorite && (
                <span className="flex items-center gap-1 text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full text-[10px] font-semibold lowercase tracking-normal">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> favorite
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {activeNote && (
                <button
                  onClick={() => toggleFavoriteNote(activeNote._id)}
                  className={`p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-sans normal-case ${
                    activeNote.isFavorite
                      ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                      : 'text-stone-400 hover:text-amber-600 hover:bg-stone-200/50'
                  }`}
                  title={activeNote.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                  type="button"
                >
                  <Star className={`w-4 h-4 ${activeNote.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {activeNote ? (
            <div className="max-w-2xl mx-auto w-full space-y-6 pt-4">
              <input
                className="w-full text-3xl md:text-5xl font-serif text-[#29312f] bg-transparent outline-none border-b border-transparent focus:border-stone-200 placeholder-stone-300 pb-2 transition-colors"
                onChange={(event) => updateActiveNoteTitle(event.target.value)}
                placeholder="Note title..."
                value={activeNote.title || ''}
              />

              <hr className="border-t border-[#ddd8cf] my-4" />

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
