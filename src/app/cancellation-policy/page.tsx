export default function CancellationPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-slate-900">
      <h1 className="font-space-grotesk text-4xl">Cancellation Policy</h1>
      <ul className="mt-6 list-disc space-y-2 pl-6 text-slate-700">
        <li>100% refund for cancellations more than 48 hours before dispatch</li>
        <li>50% refund for cancellations between 24 and 48 hours</li>
        <li>0% refund for cancellations within 24 hours</li>
      </ul>
    </main>
  )
}
