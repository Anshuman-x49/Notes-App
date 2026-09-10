import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../store/slices/authSlice'
import { RefreshCw, Star, LogOut } from 'lucide-react'

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
  isBackendConnected,
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <aside className="h-full bg-[#293b38] text-[#f7f4ed] p-3.5 md:p-6 flex flex-col justify-between overflow-y-auto no-scrollbar">
      <div>
        {/* Brand & Mobile Actions */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-base md:text-xl font-bold tracking-tight cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#e5b46a] text-[#293b38] font-bold text-base md:text-lg flex items-center justify-center shadow-xs">
              N
            </div>
            <span>Notely</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mobile user pill */}
            {user && (
              <div className="md:hidden flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#202e2c]/70 border border-[#38504b]/50 text-xs font-sans">
                <span className="w-4 h-4 rounded bg-[#e5b46a] text-[#293b38] font-bold text-[10px] flex items-center justify-center uppercase">
                  {user.username ? user.username[0] : 'U'}
                </span>
                <span className="max-w-17.5 truncate text-white text-[11px] font-medium">
                  {user.username}
                </span>
              </div>
            )}

            <button
              onClick={onRefresh}
              title="Refresh notes from server"
              className="text-[#9daea6] hover:text-white p-1 md:p-1.5 rounded-lg hover:bg-[#38504b]/50 transition-colors flex items-center justify-center cursor-pointer"
              type="button"
            >
              <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Mobile logout button */}
            {user && (
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="md:hidden text-[#9daea6] hover:text-rose-400 hover:bg-rose-500/10 p-1 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                type="button"
                aria-label="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* New Note Button */}
        <button
          className="w-full mt-3 md:mt-8 py-2 md:py-3 px-3 md:px-4 rounded-lg bg-[#e5b46a] hover:bg-[#d9a557] active:scale-[0.98] text-[#293b38] font-sans font-bold text-xs md:text-sm flex items-center justify-start gap-2 transition-all shadow-sm cursor-pointer"
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

      {/* Desktop User Profile & Logout section */}
      <div className="hidden md:flex flex-col gap-3 pt-4 border-t border-[#38504b]/60">
        {user && (
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#202e2c]/70 border border-[#38504b]/50 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#e5b46a] text-[#293b38] font-bold text-xs flex items-center justify-center shrink-0 uppercase shadow-xs">
                {user.username ? user.username[0] : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-sans font-semibold text-white truncate">
                  {user.username}
                </p>
                <p className="text-[10px] font-sans text-[#9daea6] truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#9daea6] hover:text-rose-400 hover:bg-rose-500/15 transition-colors shrink-0 cursor-pointer"
              type="button"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer status */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#9daea6]">
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="truncate">{isBackendConnected ? 'Connected to API' : 'Offline / Local Mode'}</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
