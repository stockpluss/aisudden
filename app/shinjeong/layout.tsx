import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "급등주 시그널 | 실시간 분석으로 급등주 포착",
  description:
    "거래량, 언론이슈, 기업공시를 24시간 실시간 분석해 급등 가능성이 높은 종목을 즉시 알려드립니다. 무료로 시작하세요.",
  keywords: "급등주, AI 주식, 주식 분석, 급등주 포착, 실시간 주식, 주식 시그널",
}

export const viewport: Viewport = {
  themeColor: "#1a2035",
  width: "device-width",
  initialScale: 1,
}

export default function ShinjeongLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
