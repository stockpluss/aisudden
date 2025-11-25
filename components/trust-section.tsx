import { Shield, Award, Clock, TrendingUp } from "lucide-react"

const stats = [
  { icon: Shield, label: "투명 공개", value: "매월 업데이트" },
  { icon: Award, label: "평균 수익률", value: "+47.3%" },
  { icon: Clock, label: "실시간 분석", value: "24/7" },
  { icon: TrendingUp, label: "급등주 포착", value: "일 평균 12건" },
]

export function TrustSection() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-balance text-foreground">
              검증된 실적으로 증명하는 신뢰
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 sm:p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground text-center">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
