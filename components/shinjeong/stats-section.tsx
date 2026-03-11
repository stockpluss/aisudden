"use client"

import { useEffect, useRef, useState } from "react"

interface StatItem {
  value: number
  suffix: string
  label: string
  description: string
  color: string
}

const STATS: StatItem[] = [
  {
    value: 47.3,
    suffix: "%",
    label: "평균 수익률",
    description: "AI 시그널 적용 기준",
    color: "text-primary",
  },
  {
    value: 24,
    suffix: "/7",
    label: "실시간 분석",
    description: "24시간 365일 운영",
    color: "text-accent",
  },
  {
    value: 12,
    suffix: "건",
    label: "일 평균 급등주 포착",
    description: "하루 평균 시그널 발송",
    color: "text-primary",
  },
  {
    value: 98,
    suffix: "%",
    label: "회원 만족도",
    description: "실제 이용자 설문 기준",
    color: "text-accent",
  },
]

function Counter({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const steps = 60
          const stepVal = value / steps
          let current = 0
          const timer = setInterval(() => {
            current += stepVal
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(parseFloat(current.toFixed(1)))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className={`text-4xl md:text-5xl font-black ${color}`} suppressHydrationWarning>
      +{count}{suffix}
    </div>
  )
}

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
          <p className="text-muted-foreground mt-3 text-balance">
            매달 홈페이지에 실적을 투명하게 공개합니다
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 p-6 rounded-2xl border border-border bg-background/50 text-center"
            >
              <Counter value={stat.value} suffix={stat.suffix} color={stat.color} />
              <p className="text-sm font-bold text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Transparency notice */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="h-px flex-1 bg-border max-w-[80px]" />
          <span>* 투명한 성과 공유를 위해 매달 공증을 받아 홈페이지에 업로드하고 있습니다.</span>
          <div className="h-px flex-1 bg-border max-w-[80px]" />
        </div>
      </div>
    </section>
  )
}
