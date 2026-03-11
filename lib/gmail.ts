import { google } from "googleapis"

function getGmailAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
  const senderEmail = process.env.GMAIL_SENDER_EMAIL

  if (!email) {
    throw new Error("Missing environment variable: GOOGLE_SERVICE_ACCOUNT_EMAIL")
  }
  if (!privateKey) {
    throw new Error("Missing environment variable: GOOGLE_PRIVATE_KEY")
  }
  if (!senderEmail) {
    throw new Error("Missing environment variable: GMAIL_SENDER_EMAIL")
  }

  return new google.auth.JWT({
    email,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/gmail.send"],
    subject: senderEmail, // impersonate this Workspace user
  })
}

function buildRawEmail(from: string, to: string, subject: string, body: string): string {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
  ].join("\r\n")

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

export async function sendNotificationEmail(options: {
  from: string
  to: string
  name: string
  phone: string
  timestamp: string
  sheetId: string
  sheetTab: string
  source?: string
}): Promise<{ success: boolean; error?: string }> {
  const { from, to, name, phone, timestamp, sheetId, sheetTab, source } = options

  // Skip if from or to is missing
  if (!from || !to) {
    console.log("[gmail] Skipping email (from or to is empty):", { from, to })
    return { success: true }
  }

  console.log("[gmail] Sending email:", { from, to, name })

  try {
    const auth = getGmailAuthClient()
    const gmail = google.gmail({ version: "v1", auth })

    const sourceName = source || "랜딩페이지"
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`

    const subject = `[${sheetTab}] ${name} 신규 신청`
    const body = `신규 신청이 접수되었습니다.

이름: ${name}
연락처: ${phone}
제출시간: ${timestamp}
출처: ${sourceName}
저장된 시트: ${sheetTab}

Google Sheets에서 확인하세요:
${sheetUrl}
`

    const raw = buildRawEmail(from, to, subject, body)

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    })

    console.log("[gmail] Email sent successfully:", { from, to })
    return { success: true }
  } catch (error) {
    console.error("[gmail] Email send failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
