'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
const RATING_COLORS = ['', '#f87171', '#fb923c', '#facc15', '#a3e635', '#4ade80']

/**
 * Star rating and comment form for equipment reviews.
 * Upserts on conflict (user_id, equipment_id) so each user has one review per item.
 */
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
    if (loading) return // Prevent double-submission

    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { error: err } = await supabase.from('reviews').upsert(
        { user_id: user.id, equipment_id: equipmentId, rating, comment },
        { onConflict: 'user_id,equipment_id' }
      )
      if (err) throw err

      setSubmitted(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ border: '1px solid rgba(74,222,128,0.2)', borderRadius: 16, padding: '32px', background: 'rgba(74,222,128,0.05)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, background: 'rgba(74,222,128,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg style={{ width: 24, height: 24, color: '#4ade80' }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p style={{ fontWeight: 800, color: '#fff', fontSize: 16, marginBottom: 6 }}>Review Submitted!</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Thank you for helping other contractors make better decisions.</p>
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 800, color: '#fff', fontSize: 16, marginBottom: 4 }}>
          {existingReview ? 'Update Your Review' : 'Leave a Review'}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>Your feedback helps other contractors choose the right equipment</p>
      </div>

      {/* Star rating */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Your Rating *</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} role="group" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
              aria-pressed={rating === star}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, transform: 'scale(1)', transition: 'transform 0.15s' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}>
              <svg style={{ width: 30, height: 30, color: star <= activeRating ? '#f4a261' : 'rgba(255,255,255,0.1)', transition: 'color 0.15s' }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          {activeRating > 0 && (
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: RATING_COLORS[activeRating] }}>
              {RATING_LABELS[activeRating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="review-comment" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Your Experience <span style={{ fontWeight: 400, textTransform: 'none', color: 'rgba(255,255,255,0.2)' }}>(optional)</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={e => setComment(e.target.value.slice(0, 500))}
          placeholder="How was the equipment condition? Was delivery on time? Would you recommend it?"
          rows={4}
          maxLength={500}
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#e8e8e8', outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(244,162,97,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
        />
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'right', marginTop: 4 }}>{comment.length}/500</p>
      </div>

      {error && (
        <div role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f87171', marginBottom: 14 }}>
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || rating === 0}
        style={{
          width: '100%', background: rating === 0 ? 'rgba(255,255,255,0.06)' : '#f4a261',
          color: rating === 0 ? 'rgba(255,255,255,0.25)' : '#0a0a0a',
          fontWeight: 700, padding: '13px', borderRadius: 10, border: 'none',
          fontSize: 14, cursor: loading || rating === 0 ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
        {loading ? (
          <>
            <span style={{ width: 14, height: 14, border: '2px solid rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
            Submitting…
          </>
        ) : existingReview ? '✏️ Update Review' : '⭐ Submit Review'}
      </button>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 12 }}>
        Only verified customers who rented this equipment can leave reviews
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}