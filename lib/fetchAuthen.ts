interface SignInCredentials {
  email: string
  password: string
}

const BASE_URL = 'http://cp25nk2.sit.kmutt.ac.th:8000/'

export const signIn = async (credentials: SignInCredentials) => {
  try {
    const response = await fetch(`${BASE_URL}api/v1/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Something went wrong')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Sign-in failed:', error)
    throw error
  }
}

interface SignUpCredentials {
  email: string
  password: string
  confirmPassword: string
}

export const signUp = async (credentials: SignUpCredentials) => {
  try {
    const response = await fetch(`${BASE_URL}api/v1/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Something went wrong')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Sign-up failed:', error)
    throw error
  }
}
