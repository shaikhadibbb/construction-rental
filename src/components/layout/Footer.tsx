export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            <span className="text-white font-bold text-lg">
              Construct<span className="text-yellow-500">Rent</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <a href="/catalog" className="hover:text-white transition-colors">Equipment</a>
            <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Copyright */}
          <p className="text-sm">
            © {new Date().getFullYear()} ConstructRent. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}