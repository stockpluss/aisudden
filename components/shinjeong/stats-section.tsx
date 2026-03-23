import Image from "next/image"

const IMAGES = [
  { src: "/images/shinjeong/sj_gr_01.jpg", alt: "신정투자그룹 월간 수익률 실적 그래프" },
  { src: "/images/shinjeong/sj_gr_02.jpg", alt: "신정투자그룹 급등주 포착 성공률 통계" },
  { src: "/images/shinjeong/sj_gr_03.jpg", alt: "신정투자그룹 종목별 수익 실적 차트" },
  { src: "/images/shinjeong/sj_gr_04.jpg", alt: "신정투자그룹 회원 수익 달성 현황" },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-card border-y border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            검증된 실적
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-foreground text-balance">
            실제 포착 사례
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {IMAGES.map((img) => (
            <div
              key={img.src}
              className="rounded-2xl border border-border bg-background/50 overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm md:text-base font-semibold text-foreground">
            거래량 급증 + 상승 시그널 포착 후 알림 발송
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            포착 시점 이후 상승 흐름 확인
          </p>
        </div>

      </div>
    </section>
  )
}
