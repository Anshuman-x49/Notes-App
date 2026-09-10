import { Star, Trash2 } from 'lucide-react'

/**
 * NoteCard Component (Tailwind CSS)
 * Accepts note object of type:
 * {
 *   _id: string,
 *   title: string,
 *   description: string,
 *   isFavorite?: boolean,
 * }
 */
const NoteCard = ({ note, isSelected, onClick, onDelete, onToggleFavorite }) => {
  const { _id, title, description, isFavorite } = note

  const handleDelete = (e) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(_id)
    }
  }

  const handleFavoriteToggle = (e) => {
    e.stopPropagation()
    if (onToggleFavorite) {
      onToggleFavorite(_id)
    }
  }

  return (
    <div
      className={`group relative flex flex-col gap-2 p-4 rounded-xl border transition-all cursor-pointer text-left outline-none ${
        isSelected
          ? 'border-[#d7c5ad] bg-white shadow-md ring-1 ring-[#d7c5ad]/60'
          : 'border-transparent bg-stone-100/60 hover:bg-stone-200/70 hover:border-stone-200'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <strong className="font-serif font-semibold text-base text-[#263532] truncate group-hover:text-amber-950 flex-1">
          {title || 'Untitled Note'}
        </strong>
        <div className="flex items-center gap-1">
          {onToggleFavorite && (
            <button
              type="button"
              className={`p-1.5 sm:p-1 rounded-md transition-all cursor-pointer ${
                isFavorite
                  ? 'opacity-100 text-amber-500 hover:text-amber-600 bg-amber-50'
                  : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-stone-400 hover:text-amber-500 hover:bg-stone-200/60'
              }`}
              onClick={handleFavoriteToggle}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`}
              />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 sm:p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md focus:opacity-100 cursor-pointer"
              onClick={handleDelete}
              title="Delete note"
              aria-label="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans m-0">
        {description || 'No description provided.'}
      </p>
    </div>
  )
}

export default NoteCard
