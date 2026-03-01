const STARS = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']

type Review = {
  id: string
  rating: number
  comment: string
  created_at: string
  profiles: { email: string } | null
}

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-4xl mb-2">💬</p>
        <p className="font-medium">No reviews yet</p>
        <p className="text-sm mt-1">Be the first to review this equipment</p>
      </div>
    )
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <span className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
        <div>
          <div className="text-yellow-500 text-xl">{'⭐'.repeat(Math.round(avgRating))}</div>
          <p className="text-sm text-gray-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900 text-sm">{review.profiles?.email?.split('@')[0] || 'Customer'}</p>
                <p className="text-yellow-500">{STARS[review.rating]}</p>
              </div>
              <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
            {review.comment && <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
