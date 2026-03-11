import { Brain, Target, Bell, LineChart } from "lucide-react"

const benefits = [
  {
    icon: Brain,
    title: "AI 실시간 시장 분석",
    description: "거래량, 주식시장, 언론이슈, 기업공시를 AI가 24시간 실시간으로 분석합니다",
  },
  {
    icon: Target,
    title: "정보가 아닌 전략 제시",
    description: "단순 정보 제공이 아닌, 구체적인 전략을 제공합니다",
  },
  {
    icon: Bell,
    title: "즉시 알림 발송",
    description: "급등 가능성이 높은 종목을 포착하면 바로 알림을 보내드립니다",
  },
  {
    icon: LineChart,
    title: "투명한 실적 공개",
    description: "매달 홈페이지에 실적을 투명하게 공개합니다",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-balance text-foreground">
              AI 급등주, 이렇게 다릅니다
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">{benefit.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
