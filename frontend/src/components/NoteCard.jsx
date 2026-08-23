import React from 'react'

/**
 * NoteCard Component (Tailwind CSS)
 * Accepts note object of type:
 * {
 *   _id: string,
 *   title: string,
 *   description: string,
 *   __v?: number
 * }
 */
const NoteCard = ({ note, isSelected, onClick, onDelete }) => {
  const { _id, title, description, __v } = note

  const handleDelete = (e) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(_id)
    }
  }

  const shortId = _id ? `#${_id.slice(-6)}` : ''

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
        <strong className="font-serif font-semibold text-base text-[#263532] truncate group-hover:text-amber-950">
          {title || 'Untitled Note'}
        </strong>
        {onDelete && (
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md focus:opacity-100"
            onClick={handleDelete}
            title="Delete note"
            aria-label="Delete note"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-sans m-0">
        {description || 'No description provided.'}
      </p>

      <div className="flex items-center gap-2 mt-1">
        {shortId && (
          <span
            className="font-mono text-[10px] text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-md"
            title={`ID: ${_id}`}
          >
            {shortId}
          </span>
        )}
        {typeof __v === 'number' && (
          <span className="text-[10px] font-semibold text-[#a26846] bg-[#f2e4d5] px-2 py-0.5 rounded-md">
            v{__v}
          </span>
        )}
      </div>
    </div>
  )
}

export default NoteCard
