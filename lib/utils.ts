import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// gtag conversion call
export function gtagReportConversion(url?: string) {
    if (typeof window === "undefined" || !(window as any).gtag) {
        return false;
    }

    const callback = function () {
        if (typeof url !== "undefined") {
            window.location.href = url;
        }
    };

    (window as any).gtag("event", "conversion", {
        send_to: "AW-11246851271/atwMCPTj97waEMep9fIp",
        value: 1.0,
        currency: "KRW",
        event_callback: callback,
    });

    return false;
}
