"use server"

import { appendRow } from "@/lib/google-sheets"
import { sendNotificationEmail } from "@/lib/gmail"
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

    const sheetId = process.env.SHINJEONG_SHEET_ID!
    const sheetTab = process.env.SHINJEONG_SHEET_TAB || "Sheet1"

    await appendRow(sheetId, sheetTab, [timestamp, formData.name, formData.phone, "shinjeong.vc"])

    console.log("[shinjeong] Google Sheet submission successful")

    // 이메일 알림 발송 (from/to 없으면 skip)
    const emailResult = await sendNotificationEmail({
      from: process.env.SHINJEONG_EMAIL_FROM || "",
      to: process.env.SHINJEONG_EMAIL_TO || "",
      name: formData.name,
      phone: formData.phone,
      timestamp,
      sheetId,
      sheetTab,
      source: "shinjeong.vc",
    })

    if (!emailResult.success) {
      console.error("[shinjeong] Email failed (Sheet succeeded):", emailResult.error)
    }

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
  } catch (error) {
    console.error("[shinjeong] Submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
