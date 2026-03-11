export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col gap-6">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground font-black text-sm"
              style={{ background: "oklch(0.65 0.22 255)" }}
            >
              AI
            </div>
            <span className="text-base font-black text-foreground">스탁플러스</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            AI 기반 실시간 급등주 포착 서비스. 거래량, 언론이슈, 기업공시를 분석해 투자 기회를 제공합니다.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Legal info */}
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground/70">법적 고지</p>
          <p className="leading-relaxed">
            본 서비스는 금융투자업자가 아닌 유사투자자문업자로, 개별적인 투자상담과 자금운용이 불가능합니다.
            투자 결과에 따라 투자원금의 손실이 발생할 수 있으며, 그 손실은 투자자에게 귀속됩니다.
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-muted-foreground pt-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>대표자: 홍길동</span>
            <span>사업자등록번호: 000-00-00000</span>
            <span>통신판매업신고: 2024-서울-0000호</span>
          </div>
          <p>© 2026 스탁플러스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
