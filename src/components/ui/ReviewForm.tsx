'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ReviewForm({ equipmentId, existingReview }: { equipmentId: string, existingReview?: { rating: number; comment: string } | null }) {
  const router = useRouter()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

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
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-2xl mb-1">🎉</p>
        <p className="text-green-700 font-semibold">Review submitted!</p>
        <p className="text-green-600 text-sm">Thank you for your feedback.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">{existingReview ? 'Update Your Review' : 'Leave a Review'}</h3>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="text-3xl transition-transform hover:scale-110">
            {star <= (hover || rating) ? '⭐' : '☆'}
          </button>
        ))}
        {rating > 0 && <span className="ml-2 text-sm text-gray-500 self-center">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}</span>}
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience... (optional)" rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none mb-4" />
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}
      <button onClick={handleSubmit} disabled={loading || rating === 0} className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
        {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
      </button>
    </div>
  )
}
