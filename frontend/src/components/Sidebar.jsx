import React from 'react'
import { useNavigate } from 'react-router'
import { RefreshCw, Star } from 'lucide-react'

/**
 * Sidebar Component
 * @param {function} onRefresh - Handler to reload notes from API
 * @param {boolean} loading - Loading state for refresh spinner
 * @param {function} onNewNote - Handler to open Add Note modal
 * @param {string} activeTab - Currently active navigation tab ('all' | 'favorites')
 * @param {number} totalNotesCount - Total count of all notes
 * @param {number} favoritesCount - Count of favorite notes
 * @param {boolean} isBackendConnected - API connection status
 */
const Sidebar = ({
  onRefresh,
  loading,
  onNewNote,
  activeTab,
  totalNotesCount,
  favoritesCount,
  isBackendConnected
}) => {
  const navigate = useNavigate()

  return (
    <aside className="h-full bg-[#293b38] text-[#f7f4ed] p-3.5 md:p-6 flex flex-col justify-between overflow-y-auto no-scrollbar">
      <div>
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 text-lg md:text-xl font-bold tracking-tight cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#e5b46a] text-[#293b38] font-bold text-base md:text-lg flex items-center justify-center shadow-xs">
              N
            </div>
            <span>Notely</span>
          </div>
          <button
            onClick={onRefresh}
            title="Refresh notes from server"
            className="text-[#9daea6] hover:text-white p-1 md:p-1.5 rounded-lg hover:bg-[#38504b]/50 transition-colors flex items-center justify-center"
            type="button"
          >
            <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* New Note Button */}
        <button
          className="w-full mt-3 md:mt-8 py-2 md:py-3 px-3 md:px-4 rounded-lg bg-[#e5b46a] hover:bg-[#d9a557] active:scale-[0.98] text-[#293b38] font-sans font-bold text-xs md:text-sm flex items-center justify-start gap-2 transition-all shadow-sm"
          onClick={onNewNote}
          type="button"
        >
          <span className="text-lg md:text-xl leading-none" aria-hidden="true">+</span> New note
        </button>

        {/* Navigation */}
        <nav className="mt-3 md:mt-8 flex flex-row md:flex-col gap-1 font-sans text-xs font-medium" aria-label="Note views">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#38504b] text-white shadow-xs'
                : 'text-[#b7c4bd] hover:bg-[#38504b]/50 hover:text-white'
            }`}
          >
            <span>All notes</span>
            <span className="text-[#e5b46a] font-semibold">{totalNotesCount}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/favorites')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-[#38504b] text-white shadow-xs'
                : 'text-[#b7c4bd] hover:bg-[#38504b]/50 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Favorites
            </span>
            <span className="text-[#e5b46a] font-semibold">{favoritesCount}</span>
          </button>
        </nav>
      </div>

      {/* Footer status */}
      <div className="hidden md:flex items-center gap-2 text-xs font-sans text-[#9daea6] pt-6 border-t border-[#38504b]/60">
        <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        {isBackendConnected ? 'Connected to API' : 'Offline / Local Mode'}
      </div>
    </aside>
  )
}

export default Sidebar
