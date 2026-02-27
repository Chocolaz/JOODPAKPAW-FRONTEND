import { io, Socket } from 'socket.io-client'
import { getAccessToken } from './tokenManager'

const SOCKET_URL = 'https://bscit.sit.kmutt.ac.th'
const SOCKET_PATH = '/capstone25/cp25nk2/api/socket.io'

let socket: Socket | null = null

export function connectSocket(): Socket | null {
  if (typeof window === 'undefined') return null

  const token = getAccessToken()
  if (!token) return null

  if (socket?.connected) return socket

  if (socket) {
    socket.disconnect()
    socket = null
  }

  socket = io(SOCKET_URL, {
    path: SOCKET_PATH,
    query: { token },
    transports: ['polling'],
    upgrade: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
  })

  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function getSocket(): Socket | null {
  return socket
}
