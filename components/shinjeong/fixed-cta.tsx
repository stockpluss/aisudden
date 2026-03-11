"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle2, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { submitLeadShinjeong } from "@/app/actions/submit-lead-shinjeong"
import { gtagReportConversion } from "@/lib/analytics"

function formatPhone(value: string): string {
  const n = value.replace(/\D/g, "")
  if (n.length <= 3) return n
  if (n.length <= 7) return `${n.slice(0, 3)}-${n.slice(3)}`
  return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7, 11)}`
}

export function ShinjeongFixedCTA() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dismissed, setDismissed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError("이름을 입력해주세요."); return }
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      setError("올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)")
      return
    }
    if (!agreed) { setError("개인정보 수집에 동의해주세요."); return }

    setError("")
    setLoading(true)
    try {
      gtagReportConversion("shinjeong", name.trim(), phone.trim().replace(/\D/g, ""))

      const result = await submitLeadShinjeong({
        name: name.trim(),
        phone: phone.trim(),
      })
      if (result.success) {
        setSubmitted(true)
      } else {
        setError("접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
    } catch {
      setError("접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  if (dismissed) return null

  const barStyle: React.CSSProperties = {
    background: "oklch(0.19 0.04 252 / 0.97)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid oklch(0.62 0.22 255 / 0.25)",
    boxShadow: "0 -4px 32px oklch(0.62 0.22 255 / 0.12)",
  }

  const btnStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, oklch(0.62 0.22 255), oklch(0.52 0.22 245))",
    boxShadow: "0 0 20px oklch(0.62 0.22 255 / 0.4)",
  }

  const inputCls = cn(
    "rounded-lg border bg-background/40 border-border px-3 py-2 text-sm text-foreground",
    "placeholder:text-foreground/35 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all",
    error && "border-destructive/60"
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={barStyle}>
      <div className="max-w-5xl mx-auto px-4 py-4">
        {submitted ? (
          <div className="flex items-center justify-center gap-3 py-1">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm font-bold text-foreground">
              신청 완료! 담당 매니저가 곧 연락드리겠습니다.
            </span>
            <button
              onClick={() => setDismissed(true)}
              className="ml-auto p-1 text-foreground/40 hover:text-foreground/70 transition-colors"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Mobile: stacked */}
            <div className="flex flex-col gap-3 sm:hidden">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-foreground">
                  AI 급등주<span className="text-primary"> 무료</span> 신청
                </p>
                <button type="button" onClick={() => setDismissed(true)} className="p-1 text-foreground/35 hover:text-foreground/60 transition-colors" aria-label="닫기">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError("") }}
                  placeholder="이름"
                  className={cn(inputCls, "w-24 shrink-0")}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(formatPhone(e.target.value)); setError("") }}
                  placeholder="010-1234-5678"
                  maxLength={13}
                  className={cn(inputCls, "flex-1")}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError("") }} className="h-4 w-4 rounded accent-primary" />
                  <span className="text-xs text-foreground/55">개인정보 수집 및 활용 동의</span>
                </label>
                <button type="submit" disabled={loading} className="shrink-0 rounded-xl px-5 py-3 text-sm font-black text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-60" style={btnStyle}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "무료 신청"}
                </button>
              </div>
              {error && <p className="text-xs text-destructive text-center">{error}</p>}
            </div>

            {/* Desktop: 1-liner */}
            <div className="hidden sm:flex items-center gap-3">
              <p className="text-sm font-black text-foreground whitespace-nowrap shrink-0">
                AI 급등주<span className="text-primary"> 무료</span> 받기
              </p>
              <div className="h-4 w-px bg-border shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError("") }}
                placeholder="이름"
                className={cn(inputCls, "w-24 shrink-0")}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(formatPhone(e.target.value)); setError("") }}
                placeholder="010-1234-5678"
                maxLength={13}
                className={cn(inputCls, "flex-1 min-w-0")}
              />
              <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError("") }} className="h-3.5 w-3.5 rounded accent-primary" />
                <span className="text-xs text-foreground/50 whitespace-nowrap">개인정보 동의</span>
              </label>
              <button type="submit" disabled={loading} className="shrink-0 rounded-lg px-5 py-2 text-sm font-black text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-60" style={{ ...btnStyle, boxShadow: "0 0 16px oklch(0.62 0.22 255 / 0.35)" }}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "무료 신청"}
              </button>
              {error && <p className="text-xs text-destructive shrink-0">{error}</p>}
              <button type="button" onClick={() => setDismissed(true)} className="shrink-0 p-1 rounded text-foreground/30 hover:text-foreground/60 transition-colors" aria-label="닫기">
                <X className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
