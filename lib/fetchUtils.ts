const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function get<T>(
  endpoint: string,
  params: Record<string, string | number | boolean>,
  errorContext: string
): Promise<T> {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`)
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, String(params[key]))
    )

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong')
    }

    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`${errorContext} failed:`, error.message)
    } else {
      console.error(`${errorContext} failed:`, error)
    }
    throw error
  }
}

export const getProperties = (page: number, limit: number) => {
  return get('api/v1/properties', { page, limit }, 'Get Properties')
}
