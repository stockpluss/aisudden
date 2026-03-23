import { BrainCircuit, Bell, BarChart3, ShieldCheck, Newspaper, TrendingUp } from "lucide-react"

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "실시간 시장 분석",
    description:
      "거래량, 주식시장, 언론이슈, 기업공시를 24시간 실시간으로 분석합니다. 사람이 놓치는 미세한 패턴까지 포착합니다.",
    highlight: true,
  },
  {
    icon: TrendingUp,
    title: "정보가 아닌 전략 제시",
    description:
      "단순 정보 제공이 아닌, 언제 진입하고 어떻게 대응할지 구체적인 전략을 제공합니다.",
    highlight: false,
  },
  {
    icon: Bell,
    title: "즉시 알림 발송",
    description:
      "급등 가능성이 높은 종목을 포착하면 카카오톡 또는 문자로 즉시 알림을 보내드립니다.",
    highlight: true,
  },
  {
    icon: ShieldCheck,
    title: "투명한 실적 공개",
    description:
      "매달 공증 받은 실적을 홈페이지에 공개합니다. 숨기는 것 없이 모든 결과를 투명하게 보여드립니다.",
    highlight: false,
  },
  {
    icon: Newspaper,
    title: "언론이슈 & 공시 분석",
    description:
      "수천 개의 뉴스와 기업 공시를 실시간으로 모니터링해 주가에 영향을 줄 핵심 이슈를 선별합니다.",
    highlight: false,
  },
  {
    icon: BarChart3,
    title: "거래량 이상 감지",
    description:
      "평균 거래량 대비 급격한 변화를 즉시 감지해 세력의 움직임을 사전에 포착합니다.",
    highlight: true,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
            Why Our Signal
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-foreground text-balance">
            급등주, 이렇게{" "}
            <span className="text-primary">다릅니다</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-balance">
            기존 투자 정보 서비스와 근본적으로 다른 접근 방식
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="relative group rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/40 transition-all duration-300"
                style={
                  feature.highlight
                    ? { boxShadow: "inset 0 0 40px oklch(0.65 0.22 255 / 0.06)" }
                    : {}
                }
              >
                {/* icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-border"
                style={
                  feature.highlight
                    ? {
                        background: "oklch(0.65 0.22 255 / 0.12)",
                        borderColor: "oklch(0.65 0.22 255 / 0.3)",
                      }
                    : { background: "oklch(0.78 0.15 200 / 0.08)", borderColor: "oklch(0.78 0.15 200 / 0.2)" }
                }
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: feature.highlight ? "oklch(0.65 0.22 255)" : "oklch(0.78 0.15 200)" }}
                />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* hover glow line */}
                <div
                  className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: feature.highlight
                      ? "linear-gradient(90deg, transparent, oklch(0.65 0.22 255 / 0.5), transparent)"
                      : "linear-gradient(90deg, transparent, oklch(0.78 0.15 200 / 0.5), transparent)",
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
