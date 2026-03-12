'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
const RATING_COLORS = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500']

export default function ReviewForm({
  equipmentId,
  existingReview,
}: {
  equipmentId: string
  existingReview?: { rating: number; comment: string } | null
}) {
  const router = useRouter()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const activeRating = hover || rating

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a star rating'); return }
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { error: err } = await supabase.from('reviews').upsert({
      user_id: user.id,
      equipment_id: equipmentId,
      rating,
      comment,
    }, { onConflict: 'user_id,equipment_id' })
    if (err) { setError(err.message) }
    else { setSubmitted(true); router.refresh() }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="bg-white border border-green-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="font-black text-[#0a1628] text-lg mb-1">Review Submitted!</p>
        <p className="text-gray-500 text-sm">Thank you for helping other contractors make better decisions.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h3 className="font-black text-[#0a1628] text-lg">
          {existingReview ? 'Update Your Review' : 'Leave a Review'}
        </h3>
        <p className="text-gray-400 text-sm mt-0.5">Your feedback helps other contractors choose the right equipment</p>
      </div>

      {/* Star picker */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your Rating *</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110 active:scale-95 p-1">
              <svg className={`w-8 h-8 transition-colors ${star <= activeRating ? 'text-yellow-500' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          {activeRating > 0 && (
            <span className={`ml-2 text-sm font-black ${RATING_COLORS[activeRating]}`}>
              {RATING_LABELS[activeRating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your Experience <span className="font-normal normal-case text-gray-400">(optional)</span></p>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          placeholder="How was the equipment condition? Was delivery on time? Would you recommend it?"
          rows={4}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-colors resize-none" />
        <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading || rating === 0}
        className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-100 disabled:text-gray-400 text-[#0a1628] font-black py-3.5 rounded-xl transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-500/25 text-sm">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : existingReview ? '✏️ Update Review' : '⭐ Submit Review'}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        Only verified customers who rented this equipment can leave reviews
      </p>
    </div>
  )
}