"use server"

export async function submitLead(formData: {
  name: string
  phone: string
}) {
  try {
    console.log("[v0] Starting submission with data:", { name: formData.name, phone: formData.phone })

    // 현재 시각 생성 (한국 시간)
    const now = new Date()
    const timestamp = new Intl.DateTimeFormat("ko-KR", {
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

    console.log("[v0] Formatted timestamp:", timestamp)
    console.log("[v0] Apps Script URL:", process.env.APPS_SCRIPT_URL)

    // Apps Script로 데이터 전송
    const response = await fetch(process.env.APPS_SCRIPT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: process.env.SECRET_TOKEN,
        timestamp,
        name: formData.name,
        phone: formData.phone,
      }),
      redirect: "manual",
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)

    // 200-299 또는 302 상태면 성공으로 처리
    if (response.ok || response.status === 302) {
      console.log("[v0] Submission successful")
      return { success: true }
    }

    // 실패한 경우에만 에러 처리
    console.log("[v0] Submission failed with status:", response.status)
    throw new Error(`Failed to submit data: ${response.status}`)
  } catch (error) {
    console.log("[v0] Submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
