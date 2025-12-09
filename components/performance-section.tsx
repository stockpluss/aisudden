import { TrendingUp, DollarSign } from "lucide-react"

export function PerformanceSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-slate-900 to-secondary/10">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 text-success text-sm font-semibold mb-6 border border-success/30">
              <TrendingUp className="w-4 h-4" />
              실제 수익 실적
            </div> */}
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance text-foreground">
              AI 지표를 활용한 실적을 직접 확인하세요
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">매달 홈페이지에 실적을 투명하게 공개합니다</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <img
              src="/images/photo-2025-11-24-19-04-06.jpg"
              alt="SK하이닉스 +132% 급등 실적"
              className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            />
            <img
              src="/images/photo-2025-11-24-19-04-05.jpg"
              alt="삼성전자 +60% 급등 실적"
              className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            />
            <img
              src="/images/photo-2025-11-24-19-04-02.jpg"
              alt="에코프로 +115% 급등 실적"
              className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            />
            <img
              src="/images/photo-2025-11-24-19-04-04.jpg"
              alt="로보티즈 +287% 급등 실적"
              className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>

          <div className="text-centerrounded-lg">
              <img
                  src="/images/awards.jpg"
                  alt="로보티즈 +287% 급등 실적"
                  className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              />
          </div>
        </div>
      </div>
    </section>
  )
}
