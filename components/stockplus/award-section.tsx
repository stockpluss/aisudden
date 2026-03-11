import { Trophy } from "lucide-react"

export function AwardSection() {
  return (
    <section className="py-12 sm:py-16 bg-slate-900">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">수상 내역</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <img
            src="/images/brand-reward.jpg"
            alt="2025 고객감동 우수브랜드 대상 1위"
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
