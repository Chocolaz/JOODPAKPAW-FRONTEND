'use client'

import { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useAuth } from '@/app/_components/AuthContext'
import { useChat } from '@/app/_components/ChatContext'
import { createChatRoom } from '@/lib/api'
import { toast } from 'sonner'

interface ContactHostButtonProps {
  hostId: number
}

export function ContactHostButton({ hostId }: ContactHostButtonProps) {
  const { requireAuth, user } = useAuth()
  const { refreshRooms } = useChat()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  if (user?.id === hostId) return null

  const handleOpen = () => {
    if (!requireAuth()) return
    setOpen(true)
  }

  const handleSend = async () => {
    if (!message.trim() || isSending) return
    setIsSending(true)
    try {
      await createChatRoom(hostId, message.trim())
      await refreshRooms()
      setOpen(false)
      setMessage('')
      toast.success('Message sent!')
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full border-accent-orange text-accent-orange hover:bg-accent-orange/5 gap-2"
        onClick={handleOpen}
      >
        <MessageCircle className="w-4 h-4" />
        Message Host
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl">
            <DrawerHeader>
              <DrawerTitle>Message Host</DrawerTitle>
              <DrawerDescription>
                Send a message to the host before booking.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-5 pb-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type your message..."
                rows={4}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-accent-orange transition-colors resize-none"
              />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button
                className="bg-accent-orange gap-2"
                onClick={handleSend}
                disabled={!message.trim() || isSending}
              >
                {isSending ? <Spinner className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                Send
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
