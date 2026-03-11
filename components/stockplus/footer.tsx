export function Footer() {
  return (
    <footer className="py-12 pb-40 bg-muted/50 border-t border-border">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              스탁플러스는 금융투자업자가 아닌 유사투자자문업자로, 개별적인 투자상담과 자금운용이 불가능합니다.
              <br />
              투자 결과에 따라 투자원금의 손실이 발생 할 수 있으며, 그 결과는 투자자에게 귀속됩니다.
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>(주)스탁플러스 (<a href="https://s-tockplus.com" target="_blank">https://s-tockplus.com</a>)</p>
            <p>대표자 | 이석희, 성장원, 김경덕</p>
            <p>이메일 | ceo@stockplus.im</p>
            <p>주소 | 서울 구로구 디지털로26길 61 에이스하이엔드타워</p>
            <p>사업자등록번호 | 741-87-02793</p>
            <p>통신판매업신고번호 | 제2024 - 서울구로 - 1567호</p>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 스탁플러스. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
