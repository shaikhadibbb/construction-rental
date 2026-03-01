import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">

          <div className="col-span-2 sm:col-span-1">
            <p className="text-xl font-bold mb-2">🏗️ ConstructRent</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional construction equipment rental. Book in minutes, build with confidence.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3 text-gray-300">Equipment</p>
            <div className="space-y-2 text-sm text-gray-400">
              <Link href="/catalog?category=excavators" className="block hover:text-white transition-colors">Excavators</Link>
              <Link href="/catalog?category=cranes" className="block hover:text-white transition-colors">Cranes</Link>
              <Link href="/catalog?category=forklifts" className="block hover:text-white transition-colors">Forklifts</Link>
              <Link href="/catalog" className="block hover:text-white transition-colors">View All</Link>
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3 text-gray-300">Account</p>
            <div className="space-y-2 text-sm text-gray-400">
              <Link href="/login" className="block hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="block hover:text-white transition-colors">Register</Link>
              <Link href="/dashboard" className="block hover:text-white transition-colors">Dashboard</Link>
              <Link href="/profile" className="block hover:text-white transition-colors">Profile</Link>
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3 text-gray-300">Company</p>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="text-gray-500">Built with Next.js</p>
              <p className="text-gray-500">Powered by Supabase</p>
              <p className="text-gray-500">Deployed on Vercel</p>
              <Link href="/contact" className="block hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">© 2026 ConstructRent. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Built by Adib Azam Shaikh</p>
        </div>
      </div>
    </footer>
  )
}
