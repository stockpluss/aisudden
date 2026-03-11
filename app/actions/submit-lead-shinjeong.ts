"use server"

import { sendKakaoMessage } from "./send-kakao-message"

function getKoreanTimestamp(): string {
  const now = new Date()
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  })
    .format(now)
    .replace(/\. /g, "-")
    .replace(".", "")
}

export async function submitLeadShinjeong(formData: {
  name: string
  phone: string
}) {
  try {
    const timestamp = getKoreanTimestamp()

    console.log("[shinjeong] Starting submission:", { name: formData.name, phone: formData.phone })

    const response = await fetch(process.env.SHINJEONG_APPS_SCRIPT_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: process.env.SHINJEONG_SECRET_TOKEN,
        timestamp,
        name: formData.name,
        phone: formData.phone,
        source: "shinjeong.vc",
      }),
      redirect: "manual",
    })

    if (response.ok || response.status === 302) {
      console.log("[shinjeong] Google Sheet submission successful")

      const phoneNumber = formData.phone.replace(/-/g, "")
      const kakaoResult = await sendKakaoMessage({
        to: phoneNumber,
        name: formData.name,
        templateId: process.env.SHINJEONG_KAKAO_TEMPLATE_ID,
      })

      if (!kakaoResult.success) {
        console.error("[shinjeong] Kakao failed (Sheet succeeded):", kakaoResult.error)
      }

      return { success: true }
    }

    throw new Error(`Sheet submission failed: ${response.status}`)
  } catch (error) {
    console.error("[shinjeong] Submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
