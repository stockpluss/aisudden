"use client"

import { useEffect, useRef } from "react"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Particle system for lightweight background animation
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 204, 255, ${particle.opacity})`
        ctx.fill()
      })

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 204, 255, ${0.2 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="relative min-h-[75vh] flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      <div className="container relative z-10 px-4 flex-1 flex items-start pt-20 mx-auto max-w-7xl">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium border border-secondary/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                실시간 AI 분석 중
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-balance">
              <span className="text-white">AI 시그널</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                실시간으로 급등주 포착
              </span>
            </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto text-pretty">
                  AI가 시장을 실시간 분석하고, <br/> 타점, 손절, 목표가까지 정확하게 알려드립니다
              </p>
              <div className="mt-8 space-y-3 max-w-2xl mx-auto">
                  <p className="text-base sm:text-lg text-yellow-400 font-bold">힘들게 분석해도 상승주를 놓치고 있다면?</p>
                  <p className="text-base sm:text-lg text-yellow-400 font-bold">고르는 주식마다 매번 실패하고 있다면?</p>
              </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-8 mt-12 flex justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-400 animate-bounce">
          <span className="text-sm font-medium">스크롤을 내려 실제 성과를 직접 확인하세요</span>
          <ArrowDown className="w-6 h-6" />
        </div>
      </div>
    </section>
  )
}
