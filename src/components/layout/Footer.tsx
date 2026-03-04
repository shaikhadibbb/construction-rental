import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#06101f] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-yellow-500 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-[#0a1628]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
              </div>
              <span className="font-black text-white">Construct<span className="text-yellow-500">Rent</span></span>
            </Link>
            <p className="text-sm leading-relaxed">India's most trusted construction equipment rental platform for professional contractors.</p>
            <p className="text-xs text-gray-600 mt-4">Built by Adib Azam Shaikh</p>
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-4">Equipment</p>
            <div className="space-y-2 text-sm">
              <Link href="/catalog?category=excavators" className="block hover:text-yellow-500 transition-colors">Excavators</Link>
              <Link href="/catalog?category=cranes" className="block hover:text-yellow-500 transition-colors">Cranes</Link>
              <Link href="/catalog?category=forklifts" className="block hover:text-yellow-500 transition-colors">Forklifts</Link>
              <Link href="/catalog?category=compactors" className="block hover:text-yellow-500 transition-colors">Compactors</Link>
              <Link href="/catalog?category=telehandlers" className="block hover:text-yellow-500 transition-colors">Telehandlers</Link>
              <Link href="/catalog" className="block hover:text-yellow-500 transition-colors">View All</Link>
            </div>
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-4">Company</p>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block hover:text-yellow-500 transition-colors">About Us</Link>
              <Link href="/careers" className="block hover:text-yellow-500 transition-colors">Careers</Link>
              <Link href="/contact" className="block hover:text-yellow-500 transition-colors">Contact</Link>
              <Link href="/faq" className="block hover:text-yellow-500 transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-4">Contact</p>
            <div className="space-y-3 text-sm">
              <p>📍 Mumbai, Maharashtra</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ adibazam123@gmail.com</p>
              <p>⏰ Mon–Sat, 9am–6pm IST</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 ConstructRent. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
