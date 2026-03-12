'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check, CheckCheck } from 'lucide-react'
import { useChat } from '@/app/_components/ChatContext'
import { useAuth } from '@/app/_components/AuthContext'
import { AppHeader } from '@/app/_components/AppHeader'
import type { ChatMessage } from '@/lib/api'

function formatTime(dateStr: string): string {
  const date = new Date(dateStr.replace(' ', 'T'))
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatReadAt(readAt: string): string {
  const date = new Date(readAt.replace(' ', 'T'))
  const diffMs = Date.now() - date.getTime()
  if (diffMs < 60_000) return 'Read just now'
  return `Read ${date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`
}

function MessageBubble({
  message,
  isOwn,
  showReadAt,
  showIcon,
}: {
  message: ChatMessage
  isOwn: boolean
  showReadAt: boolean
  showIcon: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isOwn && (
        <div className="w-7 h-7 lg:w-8 lg:h-8 shrink-0 relative mb-1">
          {message.sender.avatar ? (
            <Image
              src={message.sender.avatar}
              alt={message.sender.firstName}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-deep-teal/10 flex items-center justify-center">
              <span className="text-deep-teal text-xs font-semibold">
                {message.sender.firstName.charAt(0)}
              </span>
            </div>
          )}
        </div>
      )}

      <div
        className={`max-w-[72%] lg:max-w-[65%] flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}
      >
        <div
          className={`px-3.5 py-2 lg:px-5 lg:py-3 rounded-2xl text-sm lg:text-base leading-relaxed ${
            isOwn
              ? 'bg-accent-orange text-white rounded-br-sm'
              : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>
        <div
          className={`flex items-center gap-0.5 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <span className="text-[10px] lg:text-xs text-neutral-gray">
            {formatTime(message.createdAt)}
          </span>
          {isOwn && showIcon &&
            (message.readAt ? (
              <CheckCheck className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-accent-orange" />
            ) : (
              <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-neutral-gray/60" />
            ))}
        </div>
        {isOwn && showReadAt && message.readAt && (
          <span className="text-[10px] lg:text-xs text-accent-orange px-1">
            {formatReadAt(message.readAt)}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function ChatRoomPage() {
  const { id } = useParams<{ id: string }>()
  const roomId = Number(id)
  const { roomMessages, loadRoom, sendMessage, markAsRead, rooms } =
    useChat()
  const { user, requireAuth } = useAuth()
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const initialScrollDone = useRef(false)

  const messages = roomMessages[roomId] ?? []
  const room = rooms.find((r) => r.id === roomId)
  const otherUserName = room
    ? `${room.otherUser.firstName} ${room.otherUser.lastName}`
    : '...'

  useEffect(() => {
    if (!requireAuth()) return
    initialScrollDone.current = false
    prevMessagesLengthRef.current = 0
    setIsLoading(true)
    loadRoom(roomId).finally(() => setIsLoading(false))
    markAsRead(roomId)
  }, [roomId])

  // Mark as read only when a NEW message from the other user arrives after initial load
  const prevMessagesLengthRef = useRef(0)
  useEffect(() => {
    if (isLoading || messages.length === 0) return
    if (messages.length > prevMessagesLengthRef.current && initialScrollDone.current) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg && lastMsg.sender.id !== user?.id) {
        markAsRead(roomId)
      }
    }
    prevMessagesLengthRef.current = messages.length
  }, [messages.length, isLoading, roomId])

  useEffect(() => {
    if (messages.length === 0 || isLoading) return
    const el = scrollContainerRef.current
    if (!el) return
    if (!initialScrollDone.current) {
      // Double rAF ensures the browser has fully laid out all message elements
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight
          initialScrollDone.current = true
        })
      )
    } else {
      el.scrollTop = el.scrollHeight
    }
  }, [messages.length, isLoading])

  async function handleSend() {
    const content = input.trim()
    if (!content || isSending) return
    setInput('')
    setIsSending(true)
    try {
      await sendMessage(roomId, content)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSending(false)
    }
  }

  return (
    /* Mobile: full dvh. Desktop: fill the right panel (parent controls height) */
    <div className="flex flex-col h-[100dvh] lg:h-full">
      {/* Mobile header */}
      <div className="lg:hidden shrink-0">
        <AppHeader title={otherUserName} backPath="/chat" />
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        {room?.otherUser.avatar ? (
          <div className="relative w-11 h-11 shrink-0">
            <Image
              src={room.otherUser.avatar}
              alt={otherUserName}
              fill
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full bg-deep-teal/10 flex items-center justify-center shrink-0">
            <span className="text-deep-teal font-semibold">
              {otherUserName.charAt(0)}
            </span>
          </div>
        )}
        <p className="font-semibold text-deep-teal">{otherUserName}</p>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 lg:px-6 py-4 space-y-3 bg-gray-50/60"
      >
        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`h-8 rounded-2xl bg-gray-200 ${i % 2 === 0 ? 'w-2/5' : 'w-1/3'}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {(() => {
              const lastReadOwnIdx = messages.reduce(
                (acc, msg, i) =>
                  msg.sender.id === user?.id && msg.readAt ? i : acc,
                -1
              )
              const lastOwnIdx = messages.reduce(
                (acc, msg, i) =>
                  msg.sender.id === user?.id ? i : acc,
                -1
              )
              return messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.sender.id === user?.id}
                  showReadAt={i === lastReadOwnIdx}
                  showIcon={i === lastOwnIdx}
                />
              ))
            })()}
          </AnimatePresence>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 bg-white border-t border-gray-100">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 lg:py-3 text-sm lg:text-base outline-none focus:border-accent-orange transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-accent-orange flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity hover:bg-accent-orange/90"
        >
          <Send className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
        </button>
      </div>
    </div>
  )
}
