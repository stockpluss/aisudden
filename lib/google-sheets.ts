import { google } from "googleapis"

function getAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY

  if (!email) {
    throw new Error("Missing environment variable: GOOGLE_SERVICE_ACCOUNT_EMAIL")
  }
  if (!privateKey) {
    throw new Error("Missing environment variable: GOOGLE_PRIVATE_KEY")
  }

  return new google.auth.JWT({
    email,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
}

export async function appendRow(
  sheetId: string,
  tabName: string,
  values: string[]
): Promise<void> {
  const auth = getAuthClient()
  const sheets = google.sheets({ version: "v4", auth })

  const maxAttempts = 3
  let lastError: unknown

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: tabName,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [values] },
      })
      return
    } catch (error: unknown) {
      lastError = error

      const statusCode =
        error instanceof Error && "code" in error
          ? (error as { code: number }).code
          : undefined

      // Retry only on rate limit or server errors
      if (statusCode === 429 || statusCode === 500 || statusCode === 503) {
        if (attempt < maxAttempts - 1) {
          const delay = Math.pow(2, attempt) * 1000 // 1s, 2s
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
      }

      // Non-retryable error - throw immediately
      break
    }
  }

  // Enhance permission denied errors
  if (lastError instanceof Error) {
    const statusCode =
      "code" in lastError ? (lastError as { code: number }).code : undefined
    const message = lastError.message.toLowerCase()

    if (
      statusCode === 403 ||
      message.includes("permission") ||
      message.includes("forbidden")
    ) {
      throw new Error(
        `Permission denied for sheet "${sheetId}". Ensure the sheet is shared with the Service Account: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`
      )
    }
  }

  throw lastError
}
