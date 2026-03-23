"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, ArrowDown } from "lucide-react"

const PAIN_POINTS = [
  "힘들게 분석해도 상승주를 놓치고 있다면?",
  "고르는 주식마다 매번 실패하고 있다면?",
]

// AI analysis signal meter — the jlinvestad-style "hook" element
const SIGNALS = [
  { label: "거래량 이상 징후", score: 92, color: "oklch(0.62 0.22 255)" },
  { label: "언론 충격도", score: 78, color: "oklch(0.78 0.15 200)" },
  { label: "외국인 순매수", score: 85, color: "oklch(0.62 0.22 255)" },
  { label: "기업공시 영향도", score: 61, color: "oklch(0.78 0.15 200)" },
  { label: "시세 모멘텀", score: 88, color: "oklch(0.62 0.22 255)" },
]

function AISignalPanel({ visible, compact = false }: { visible: boolean; compact?: boolean }) {
  const signals = compact ? SIGNALS.slice(0, 3) : SIGNALS
  return (
    <div
      className="w-full max-w-sm rounded-2xl border border-border/60 overflow-hidden shadow-2xl"
      style={{ background: "oklch(0.19 0.04 252 / 0.95)", backdropFilter: "blur(16px)" }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-border/40"
        style={{ background: "oklch(0.14 0.03 252 / 0.8)" }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <span className="text-xs font-bold text-foreground/90">
            분석 진행 중
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          KOSPI · KOSDAQ
        </span>
      </div>

      {/* Scanning line effect */}
      <div className="relative overflow-hidden">
        {visible && (
          <div
            className="absolute left-0 right-0 h-px pointer-events-none animate-scan z-10"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.62 0.22 255 / 0.6), transparent)" }}
          />
        )}

        {/* Signal rows */}
        <div className={`flex flex-col px-4 py-4 ${compact ? "gap-3" : "gap-4 px-5 py-5"}`}>
          {signals.map((sig, i) => (
            <div key={sig.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-foreground/75">{sig.label}</span>
                <span
                  className="text-xs font-black tabular-nums"
                  style={{ color: sig.color }}
                >
                  {visible ? sig.score : 0}pts
                </span>
              </div>
              <div
                className="h-2 w-full rounded-full overflow-hidden"
                style={{ background: "oklch(0.28 0.04 252)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${sig.color}, ${i % 2 === 0 ? "oklch(0.78 0.15 200)" : "oklch(0.62 0.22 255)"})`,
                    width: visible ? `${sig.score}%` : "0%",
                    transition: `width 1.4s cubic-bezier(0.4,0,0.2,1) ${i * 0.18}s`,
                    boxShadow: `0 0 8px ${sig.color}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert footer */}
      <div
        className="px-4 py-2.5 border-t border-border/40 flex items-center justify-between"
        style={{ background: "oklch(0.62 0.22 255 / 0.08)" }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-bold text-primary">
            급등 신호 감지
          </span>
        </div>
        <span
          className="text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ background: "oklch(0.62 0.22 255 / 0.2)", color: "oklch(0.62 0.22 255)" }}
        >
          3개 종목
        </span>
      </div>
    </div>
  )
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [panelVisible, setPanelVisible] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    // Trigger panel animation shortly after mount for dramatic effect
    const t = setTimeout(() => setPanelVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
  }

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, oklch(0.20 0.05 260) 0%, oklch(0.16 0.03 252) 50%, oklch(0.14 0.04 245) 100%)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.62 0.22 255) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 255) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Blue radial glow — top left */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.62 0.22 255 / 0.14), transparent 60%)" }}
      />
      {/* Cyan glow — bottom right */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.15 200 / 0.09), transparent 65%)" }}
      />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-5 py-4 lg:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-20">

          {/* Left — copy */}
          <div className="flex-1 flex flex-col items-center lg:items-start gap-5 lg:gap-8 text-center lg:text-left w-full">
            {/* Badge */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-sm text-foreground/80 font-semibold">
                실시간 시장 분석 중
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-[64px] font-black leading-[1.1] tracking-tight text-balance">
              <span className="text-foreground">
                혼자 찾기 어려운 급등주,
              </span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, oklch(0.62 0.22 255), oklch(0.78 0.15 200))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 24px oklch(0.62 0.22 255 / 0.45))",
                }}
              >
                실시간 알림으로 받아보세요
              </span>
            </h1>

            {/* AI Signal Panel — visible on mobile right after headline, hidden on lg (shown in right column) */}
            <div ref={panelRef} className="w-full block lg:hidden">
              <AISignalPanel visible={mounted && panelVisible} compact />
            </div>

            <p className="text-sm md:text-lg text-foreground/70 leading-relaxed max-w-lg text-balance">
              거래량 · 언론이슈 · 기업공시를{" "}
              <span className="text-foreground font-semibold">24시간</span>
              {" "}분석해 급등 가능성이 높은 종목을 즉시 알려드립니다.
            </p>

            {/* Pain points */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {PAIN_POINTS.map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium text-foreground/85"
                  style={{ borderColor: "oklch(0.62 0.22 25 / 0.45)", background: "oklch(0.62 0.22 25 / 0.08)" }}
                >
                  <TrendingUp className="h-4 w-4 rotate-180 shrink-0" style={{ color: "oklch(0.72 0.2 25)" }} />
                  {text}
                </div>
              ))}
            </div>


            <p className="text-xs text-foreground/35">
              * 투자 결과에 따라 원금 손실이 발생할 수 있으며, 그 손실은 투자자에게 귀속됩니다.
            </p>
          </div>

          {/* Right — AI signal panel (desktop only) */}
          <div className="flex-1 justify-center lg:justify-end w-full max-w-sm lg:max-w-none hidden lg:flex">
            <AISignalPanel visible={mounted && panelVisible} />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={scrollDown}
        className="relative z-10 mb-8 mx-auto flex flex-col items-center gap-1.5 text-foreground/35 hover:text-foreground/60 transition-colors animate-bounce"
        aria-label="아래로 스크롤"
      >
        <span className="text-xs tracking-wider uppercase font-semibold">Scroll</span>
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
    </section>
  )
}
