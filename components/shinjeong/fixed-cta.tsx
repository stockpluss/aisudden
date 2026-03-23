"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { submitLeadShinjeong } from "@/app/actions/submit-lead-shinjeong"
import { gtagReportConversion } from "@/lib/analytics"

export function ShinjeongFixedCTA() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    agreed: true,
  })

  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 10)}`
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("이름을 입력해주세요.")
      return
    }

    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      alert("올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)")
      return
    }

    try {
      setIsSubmitting(true)
      gtagReportConversion("shinjeong", formData.name.trim(), formData.phone.trim().replace(/\D/g, ""))

      const result = await submitLeadShinjeong({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      })

      if (result.success) {
        setIsSubmitted(true)
      } else {
        alert("접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        console.error("[shinjeong] Submission error:", result.error)
      }
    } catch (error) {
      alert("접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      console.error("[shinjeong] Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div
        id="cta"
        className="fixed bottom-0 left-0 right-0 z-50 shadow-2xl"
        style={{
          background: "oklch(0.19 0.04 252 / 0.97)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid oklch(0.62 0.22 255 / 0.25)",
          boxShadow: "0 -4px 32px oklch(0.62 0.22 255 / 0.12)",
        }}
      >
        <div className="container px-3 py-3 sm:py-4 mx-auto max-w-7xl">
          <div className="max-w-5xl mx-auto">
            {isSubmitted ? (
              <div className="text-center py-2">
                <h3 className="text-base sm:text-lg font-bold text-primary-foreground mb-1">신청이 완료되었습니다.</h3>
                <p className="text-xs sm:text-sm text-primary-foreground/90">
                  빠른 시일 내에 담당 매니저를 통해 안내드리겠습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-bold text-primary-foreground mb-1">
                    AI 급등주<span className="text-primary"> 무료</span> 받기
                  </h3>
                </div>

                <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
                  <Input
                    type="text"
                    placeholder="이름"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 h-10 text-sm"
                    disabled={isSubmitting}
                  />

                  <Input
                    type="tel"
                    placeholder="연락처 (- 제외, 숫자만)"
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      setFormData({ ...formData, phone: formatted })
                    }}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 h-10 text-sm"
                    disabled={isSubmitting}
                    maxLength={13}
                  />

                  <Button
                    type="submit"
                    size="sm"
                    disabled={!formData.agreed || isSubmitting}
                    className="h-10 px-6 sm:px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-sm sm:text-base shadow-lg disabled:opacity-50 whitespace-nowrap"
                  >
                    {isSubmitting ? "전송중..." : "무료 받기"}
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="privacy-shinjeong"
                      checked={formData.agreed}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreed: checked as boolean })}
                      className="border-white bg-white/20"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="privacy-shinjeong" className="text-xs sm:text-sm text-primary-foreground/90 cursor-pointer">
                      개인정보 수집 및 이용에 동의합니다{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setPrivacyModalOpen(true)
                        }}
                        className="underline"
                      >
                        (자세히 보기)
                      </button>
                    </label>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>개인정보처리방침</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <p className="font-semibold">시행일자: 2025년 7월 29일</p>

              <p>
                신정투자그룹(이하 &ldquo;회사&rdquo;라 함)는 이용자의 개인정보를 소중히 여기며, 『개인정보 보호법』 등 관련 법령을
                준수하고 있습니다. 본 개인정보처리방침은 회사가 운영하는 서비스 내 푸터 문의폼 기능을 통해 수집되는
                개인정보의 처리에 대해 안내합니다.
              </p>

              <div>
                <h3 className="font-semibold mb-2">1. 수집하는 개인정보 항목</h3>
                <p>– 이름, 연락처(휴대전화번호)</p>
                <p>– 자동 수집 항목 없음 (쿠키, 로그 등)</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. 수집 방법</h3>
                <p>– 홈페이지 내 문의하기(상담신청) 양식을 통한 직접 입력</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. 개인정보 이용 목적</h3>
                <p>– 문의사항 확인 및 상담 응대</p>
                <p>– 향후 문의 이력 관리</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. 보유 및 이용 기간</h3>
                <p>– 개인정보는 수집 목적 달성 후 최대 1년 보관 후 자동 파기</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5. 개인정보의 제3자 제공</h3>
                <p>– 회사는 개인정보를 제3자에게 제공하지 않습니다.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">6. 개인정보 처리 위탁</h3>
                <p>– Cloudways Ltd. : 웹사이트 서버 및 데이터베이스 호스팅 운영</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">7. 개인정보 보호책임자</h3>
                <p>– 책임자: 이석희, 성장원, 김경덕</p>
                <p>– 이메일: ce_oo@naver.com</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">8. 고지의 의무</h3>
                <p>– 본 방침은 변경 시 최소 7일 전 웹사이트를 통해 공지됩니다.</p>
              </div>

              <div className="pt-4 border-t">
                <p>공고일자: 2025년 7월 29일</p>
                <p>시행일자: 2025년 7월 29일</p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
