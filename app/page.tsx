import Link from "next/link"

export default function DevIndexPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Development Index</h1>
        <p className="text-muted-foreground">Select a site to preview:</p>
        <div className="flex flex-col gap-3">
          <Link href="/?site=stockplus" className="text-primary hover:underline">
            stockplus.im
          </Link>
          <Link href="/?site=shinjeong" className="text-primary hover:underline">
            shinjeong.vc
          </Link>
        </div>
      </div>
    </main>
  )
}
