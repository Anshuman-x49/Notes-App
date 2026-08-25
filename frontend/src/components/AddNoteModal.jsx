import { useForm } from 'react-hook-form'

/**
 * AddNoteModal Component using React Hook Form
 * @param {boolean} isOpen - controls modal visibility
 * @param {function} onClose - function to close modal
 * @param {function} onAddNote - callback with form data { title, description }
 * @param {boolean} isSubmitting - loading state during submission
 */
const AddNoteModal = ({ isOpen, onClose, onAddNote, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: ''
    }
  })

  if (!isOpen) return null

  const onSubmit = async (data) => {
    await onAddNote(data)
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#fbfaf7] border border-[#d9d4cb] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden font-serif">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ddd8cf] bg-[#f4f1eb]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e5b46a]" />
            <h2 className="text-xl font-bold text-[#263532] tracking-tight">Create New Note</h2>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors font-sans text-sm"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form using react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          {/* Title input */}
          <div className="flex flex-col gap-1.5 font-sans">
            <label htmlFor="note-title" className="text-xs font-semibold uppercase tracking-wider text-[#a26846]">
              Note Title
            </label>
            <input
              id="note-title"
              type="text"
              placeholder="e.g. AJ sunday nahii hai"
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.title ? 'border-red-400 focus:ring-red-200' : 'border-[#d9d4cb] focus:ring-[#a26846]/20'
              } rounded-lg text-sm text-[#29312f] outline-none focus:ring-2 transition-all placeholder-stone-300 font-serif`}
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 80,
                  message: 'Title must be less than 80 characters'
                }
              })}
            />
            {errors.title && (
              <span className="text-xs text-red-500 font-sans font-medium">{errors.title.message}</span>
            )}
          </div>

          {/* Description input */}
          <div className="flex flex-col gap-1.5 font-sans">
            <label htmlFor="note-description" className="text-xs font-semibold uppercase tracking-wider text-[#a26846]">
              Note Description
            </label>
            <textarea
              id="note-description"
              rows="5"
              placeholder="e.g. Aj RAVIVAR HAI AUR KAL SOMVAR..."
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.description ? 'border-red-400 focus:ring-red-200' : 'border-[#d9d4cb] focus:ring-[#a26846]/20'
              } rounded-lg text-sm text-[#29312f] outline-none focus:ring-2 transition-all placeholder-stone-300 font-serif resize-none`}
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters long'
                }
              })}
            />
            {errors.description && (
              <span className="text-xs text-red-500 font-sans font-medium">{errors.description.message}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ddd8cf]/60 font-sans">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-200/60 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-[#293b38] bg-[#e5b46a] hover:bg-[#d9a557] active:scale-[0.98] rounded-lg shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNoteModal
