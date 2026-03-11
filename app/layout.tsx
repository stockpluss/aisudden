import type React from "react"
import {Geist} from "next/font/google"
import {Analytics} from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({subsets: ["latin"]})

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ko">
        <body className={`${geist.className} font-sans antialiased`}>
        {children}
        <Analytics/>
        </body>
        </html>
    )
}
