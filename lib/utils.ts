import {clsx, type ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// gtag conversion call
export function gtagReportConversion(name: string, phoneNumber: string) {
    if (typeof window === "undefined" || !(window as any).gtag) {
        return;
    }

    const normalizedPhone = `+82${phoneNumber.slice(1)}`; // 010xxxx → +8210xxxx

    (window as any).gtag("set", "user_data", {
        "address": {"first_name": name},
        "phone_number": normalizedPhone
    });

    // old
    (window as any).gtag("event", "conversion", {
        send_to: "AW-11246851271/atwMCPTj97waEMep9fIp",
        value: 1.0,
        currency: "KRW",
    });

    // new
    (window as any).gtag("event", "conversion", {
        send_to: "AW-17780944854/mF1tCNr8m8wbENbfzp5C",
        value: 1.0,
        currency: "KRW",
    });
}
