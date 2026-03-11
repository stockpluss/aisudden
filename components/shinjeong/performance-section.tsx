import { TrendingUp, TrendingDown, Calendar, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface PerformanceRecord {
  month: string
  winRate: string
  avgReturn: string
  topPick: string
  topReturn: string
  positive: boolean
  isLatest?: boolean
}

const RECORDS: PerformanceRecord[] = [
  {
    month: "2025\ub144 11\uc6d4",
    winRate: "78%",
    avgReturn: "+31.4%",
    topPick: "\uc5d0\ucf54\ud504\ub85c",
    topReturn: "+67.2%",
    positive: true,
  },
  {
    month: "2025\ub144 12\uc6d4",
    winRate: "82%",
    avgReturn: "+38.9%",
    topPick: "\ud3ec\uc2a4\ucf54\ud648\ub529\uc2a4",
    topReturn: "+54.1%",
    positive: true,
  },
  {
    month: "2026\ub144 1\uc6d4",
    winRate: "71%",
    avgReturn: "+27.5%",
    topPick: "\uc0bc\uc131SDI",
    topReturn: "+48.3%",
    positive: true,
  },
  {
    month: "2026\ub144 2\uc6d4",
    winRate: "85%",
    avgReturn: "+47.3%",
    topPick: "LG\uc5d0\ub108\uc9c0\uc194\ub8e8\uc158",
    topReturn: "+89.7%",
    positive: true,
    isLatest: true,
  },
]

function MobileCard({ record }: { record: PerformanceRecord }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border p-5 flex flex-col gap-4",
        record.isLatest && "border-primary/40"
      )}
      style={record.isLatest ? { background: "oklch(0.62 0.22 255 / 0.07)" } : { background: "oklch(0.21 0.035 252)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-foreground">{record.month}</span>
        {record.isLatest && (
          <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {"\ucd5c\uc2e0"}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground font-medium">{"\uc2b9\ub960"}</span>
          <span className="text-lg font-black text-accent">{record.winRate}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground font-medium">{"\ud3c9\uade0 \uc218\uc775\ub960"}</span>
          <span
            className={cn("text-lg font-black flex items-center gap-1", record.positive ? "text-primary" : "text-destructive")}
          >
            {record.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {record.avgReturn}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground font-medium">{"\ucd5c\uace0 \uc885\ubaa9"}</span>
          <span className="text-sm font-semibold text-foreground/80">{record.topPick}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground font-medium">{"\ucd5c\uace0 \uc218\uc775\ub960"}</span>
          <span
            className="text-sm font-black px-2.5 py-1 rounded-full w-fit"
            style={{
              background: "oklch(0.62 0.22 255 / 0.14)",
              color: "oklch(0.62 0.22 255)",
              border: "1px solid oklch(0.62 0.22 255 / 0.3)",
            }}
          >
            {record.topReturn}
          </span>
        </div>
      </div>
    </div>
  )
}

export function PerformanceSection() {
  return (
    <section className="py-20 border-y border-border" style={{ background: "oklch(0.18 0.032 252)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
              {"\uc2e4\uc801 \uacf5\uac1c"}
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-foreground text-balance">
              {"AI \uc9c0\ud45c\ub97c \ud65c\uc6a9\ud55c \uc2e4\uc801\uc744"}
              <br className="hidden md:block" />
              <span className="text-primary">{" \uc9c1\uc811 \ud655\uc778\ud558\uc138\uc694"}</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 w-fit shrink-0">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              {"\ub9e4\uc6d4 \uc5c5\ub370\uc774\ud2b8 \u00b7 \ud22c\uba85 \uacf5\uac1c"}
            </span>
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-3 md:hidden">
          {RECORDS.map((record) => (
            <MobileCard key={record.month} record={record} />
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block rounded-2xl border border-border overflow-hidden">
          {/* Table header */}
          <div
            className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-border"
            style={{ background: "oklch(0.25 0.035 252)" }}
          >
            {[
              { icon: Calendar, label: "\uc6d4" },
              { label: "\uc2b9\ub960" },
              { label: "\ud3c9\uade0 \uc218\uc775\ub960" },
              { label: "\ucd5c\uace0 \uc885\ubaa9" },
              { label: "\ucd5c\uace0 \uc218\uc775\ub960" },
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={cn(
                  "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
                  i > 0 && "justify-center"
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
              </div>
            ))}
          </div>

          {RECORDS.map((record, i) => (
            <div
              key={record.month}
              className={cn(
                "grid grid-cols-5 gap-4 px-6 py-5 items-center border-b border-border last:border-0 hover:bg-secondary/30 transition-colors",
                record.isLatest && "bg-primary/5"
              )}
            >
              <div className="flex items-center gap-2">
                {record.isLatest && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                    {"\ucd5c\uc2e0"}
                  </span>
                )}
                <span className="text-sm font-semibold text-foreground">{record.month}</span>
              </div>
              <div className="flex justify-center">
                <span className="text-sm font-bold text-accent">{record.winRate}</span>
              </div>
              <div className="flex justify-center">
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm font-bold",
                    record.positive ? "text-primary" : "text-destructive"
                  )}
                >
                  {record.positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {record.avgReturn}
                </span>
              </div>
              <div className="flex justify-center">
                <span className="text-sm text-muted-foreground">{record.topPick}</span>
              </div>
              <div className="flex justify-center">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: "oklch(0.62 0.22 255 / 0.12)",
                    color: "oklch(0.62 0.22 255)",
                    border: "1px solid oklch(0.62 0.22 255 / 0.3)",
                  }}
                >
                  {record.topReturn}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {"* \uc704 \uc2e4\uc801\uc740 \uacf5\uc99d\ub41c \uc790\ub8cc\ub97c \uae30\ubc18\uc73c\ub85c \ud558\uba70, \uacfc\uac70 \uc131\uacfc\uac00 \ubbf8\ub798 \uc218\uc775\uc744 \ubcf4\uc7a5\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."}
        </p>
      </div>
    </section>
  )
}
