export default function CatalogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="h-10 w-64 bg-gray-200 rounded-xl animate-pulse mb-2"></div>
        <div className="h-5 w-48 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
      <div className="flex gap-2 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-5 space-y-3">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
