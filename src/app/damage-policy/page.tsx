export default function DamagePolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-slate-900">
      <h1 className="font-space-grotesk text-4xl">Damage Policy</h1>
      <p className="mt-4 text-slate-700">Liability matrix for Basic, Standard, and Premium protection tiers.</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr><th className="p-3">Tier</th><th className="p-3">Fee</th><th className="p-3">Liability</th></tr>
          </thead>
          <tbody>
            <tr><td className="p-3">Basic</td><td className="p-3">Free</td><td className="p-3">100% customer liability</td></tr>
            <tr><td className="p-3">Standard</td><td className="p-3">8%</td><td className="p-3">10% liability capped at ₹50,000</td></tr>
            <tr><td className="p-3">Premium</td><td className="p-3">15%</td><td className="p-3">Zero liability (except fraud)</td></tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}
