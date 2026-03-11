type SiteAnalyticsConfig = {
  ga4Id: string
  adsIds: { id: string; conversionLabel: string }[]
}

const SITE_ANALYTICS: Record<string, SiteAnalyticsConfig> = {
  stockplus: {
    ga4Id: "G-K45WKWMEYX",
    adsIds: [
      { id: "AW-11246851271", conversionLabel: "atwMCPTj97waEMep9fIp" },
      { id: "AW-17780944854", conversionLabel: "mF1tCNr8m8wbENbfzp5C" },
    ],
  },
  shinjeong: {
    ga4Id: "",
    adsIds: [],
  },
}

export function getAnalyticsConfig(site: string): SiteAnalyticsConfig | undefined {
  return SITE_ANALYTICS[site]
}

export function gtagReportConversion(site: string, name: string, phoneNumber: string) {
  if (typeof window === "undefined" || !(window as any).gtag) {
    return
  }

  const config = SITE_ANALYTICS[site]
  if (!config || config.adsIds.length === 0) {
    return
  }

  const normalizedPhone = `+82${phoneNumber.slice(1)}`

  ;(window as any).gtag("set", "user_data", {
    address: { first_name: name },
    phone_number: normalizedPhone,
  })

  for (const ads of config.adsIds) {
    ;(window as any).gtag("event", "conversion", {
      send_to: `${ads.id}/${ads.conversionLabel}`,
      value: 1.0,
      currency: "KRW",
    })
  }
}
