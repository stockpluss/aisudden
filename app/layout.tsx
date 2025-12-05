import type React from "react"
import type {Metadata} from "next"
import Script from "next/script"
import {Geist} from "next/font/google"
import {Analytics} from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "AI 급등주포착 | 스탁플러스",
    description: "AI가 실시간으로 분석하고 알려주는 급등주 정보. 매달 공증된 실적 공개.",
    generator: "v0.app",
    icons: {
        icon: [
            {
                url: "/icon-light-32x32.png",
                media: "(prefers-color-scheme: light)",
            },
            {
                url: "/icon-dark-32x32.png",
                media: "(prefers-color-scheme: dark)",
            },
            {
                url: "/icon.svg",
                type: "image/svg+xml",
            },
        ],
        apple: "/apple-icon.png",
    },
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ko">
        <head>
            {/* Google tag (gtag.js) */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-K45WKWMEYX"
                strategy="afterInteractive"
            />
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=AW-17780944854"
                strategy="afterInteractive"
            />
            <Script id="google-gtag-init" strategy="afterInteractive">
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // GA4 초기화
            gtag('config', 'G-K45WKWMEYX');
            gtag('config', 'AW-17780944854');
          `}
            </Script>
        </head>
        <body className={`${geist.className} font-sans antialiased`}>
        {children}
        <Analytics/>
        </body>
        </html>
    )
}
