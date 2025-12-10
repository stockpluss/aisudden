"use server"

import { SolapiMessageService } from "solapi"

export async function sendKakaoMessage(params: { to: string; name: string }) {
  try {
    console.log("[kakao] Starting kakao message with data:", {
      to: params.to,
      name: params.name,
    })

    const messageService = new SolapiMessageService(
      process.env.SOLAPI_API_KEY!,
      process.env.SOLAPI_API_SECRET_KEY!
    )

    const result = await messageService.send({
      to: params.to,
      from: process.env.SOLAPI_FROM_NUMBER!,
      kakaoOptions: {
        pfId: process.env.KAKAO_CHANNEL_ID!,
        templateId: process.env.KAKAO_TEMPLATE_ID!,
        disableSms: false, // Send SMS if kakao message failed
        variables: {
          "#{name}": params.name,
        },
      },
    })

    console.log("[kakao] Message sent successfully:", result)
    return { success: true }
  } catch (error) {
    console.error("[kakao] Failed to send message:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
