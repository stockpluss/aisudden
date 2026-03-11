import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
    title: "AI 급등주포착 | 스탁플러스",
    description: "AI가 실시간으로 분석하고 알려주는 급등주 정보. 매달 공증된 실적 공개.",
    icons: {
        icon: "/logo_64.png",
        apple: "/logo_64.png",
    },
}

export default function StockplusLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-K45WKWMEYX"
                strategy="afterInteractive"
            />
            <Script id="google-gtag-init" strategy="afterInteractive">
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // GA4
            gtag('config', 'G-K45WKWMEYX', {'allow_enhanced_conversions': true});
            // Google Ads (new)
            gtag('config', 'AW-17780944854', {'allow_enhanced_conversions': true});
            // Google Ads (old) - conversion용
            gtag('config', 'AW-11246851271', {'allow_enhanced_conversions': true});
          `}
            </Script>
            {children}
        </>
    )
}
