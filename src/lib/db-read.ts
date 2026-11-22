const retryableDatabaseCodes = new Set(['P2024', 'P1001', 'P1017'])

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined
  }

  return typeof error.code === 'string' ? error.code : undefined
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delay: number },
  route: string
): Promise<T> {
  const startedAt = Date.now()

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      const code = getErrorCode(error)
      const canRetry = code !== undefined && retryableDatabaseCodes.has(code)

      if (!canRetry || attempt >= options.retries) {
        console.error(
          JSON.stringify({
            event: 'database_read_failed',
            route,
            code: code ?? 'UNKNOWN',
            durationMs: Date.now() - startedAt,
          })
        )
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, options.delay))
    }
  }
}
