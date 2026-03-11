"use server"

import { appendRow } from "@/lib/google-sheets"
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

export async function submitLead(formData: {
  name: string
  phone: string
}) {
  try {
    const timestamp = getKoreanTimestamp()

    console.log("[stockplus] Starting submission:", { name: formData.name, phone: formData.phone })

    await appendRow(
      process.env.STOCKPLUS_SHEET_ID!,
      process.env.STOCKPLUS_SHEET_TAB || "Sheet1",
      [timestamp, formData.name, formData.phone]
    )

    console.log("[stockplus] Google Sheet submission successful")

    // 카카오 알림톡 전송 (실패해도 전체는 성공으로 처리)
    const phoneNumber = formData.phone.replace(/-/g, "")
    const kakaoResult = await sendKakaoMessage({
      to: phoneNumber,
      name: formData.name,
      templateId: process.env.KAKAO_TEMPLATE_ID,
    })

    if (!kakaoResult.success) {
      console.error("[stockplus] Kakao failed (Sheet succeeded):", kakaoResult.error)
    }

    return { success: true }
  } catch (error) {
    console.error("[stockplus] Submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
