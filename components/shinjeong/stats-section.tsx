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
            숫자로 증명하는 신뢰
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

      </div>
    </section>
  )
}
