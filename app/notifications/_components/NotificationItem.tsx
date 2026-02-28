'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AppNotification } from '@/types'
import { BOOKING_DETAIL_ACTIONS } from '../_constants'
import { getActionConfig } from '../_utils'
import { itemVariants } from '../_variants'

const SWIPE_THRESHOLD = 40
const DELETE_BTN_WIDTH = 80

interface Props {
  notification: AppNotification
  onRead: (id: string) => void
  onDelete: (id: string) => Promise<void>
}

export function NotificationItem({ notification, onRead, onDelete }: Props) {
  const router = useRouter()
  const cfg = getActionConfig(notification.actionName, notification.roleName)
  const { Icon } = cfg
  const timeAgo = formatDistanceToNow(new Date(notification.receivedAt), { addSuffix: true })

  const controls = useAnimation()
  const isDragging = useRef(false)
  const isOpen = useRef(false)

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      controls.start({ x: -DELETE_BTN_WIDTH })
      isOpen.current = true
    } else {
      controls.start({ x: 0 })
      isOpen.current = false
    }
    setTimeout(() => { isDragging.current = false }, 50)
  }

  const handleClick = () => {
    if (isDragging.current) return
    if (isOpen.current) {
      controls.start({ x: 0 })
      isOpen.current = false
      return
    }
    onRead(notification.id)
    if (BOOKING_DETAIL_ACTIONS.has(notification.actionName ?? '') && notification.referenceId) {
      if (notification.roleName === 'host') {
        router.push(`/profile/host/booking/${notification.referenceId}?from=notifications`)
      } else {
        router.push(`/profile/bookings/${notification.referenceId}?from=notifications`)
      }
    }
  }

  const handleDelete = async () => {
    await controls.start({
      x: -400,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeIn' },
    })
    onDelete(notification.id)
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="overflow-hidden"
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: -DELETE_BTN_WIDTH, right: 0 }}
        dragElastic={0.08}
        animate={controls}
        onDragStart={() => { isDragging.current = true }}
        onDragEnd={handleDragEnd}
        style={{ display: 'flex', width: `calc(100% + ${DELETE_BTN_WIDTH}px)` }}
      >
        {/* Card */}
        <div
          onClick={handleClick}
          className={cn(
            'flex items-start gap-3 px-4 py-3.5 cursor-pointer select-none flex-1 min-w-0',
            notification.isRead ? 'bg-white' : 'bg-orange-50'
          )}
        >
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5', cfg.bg)}>
            <Icon className={cn('w-5 h-5', cfg.color)} />
          </div>

          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm leading-snug transition-all duration-300',
              notification.isRead ? 'font-normal text-gray-600' : 'font-semibold text-gray-900'
            )}>
              {notification.title}
            </p>
            {notification.message && (
              <p className="text-xs text-neutral-gray mt-0.5 line-clamp-2 leading-relaxed">
                {notification.message}
              </p>
            )}
            <p className="text-[11px] text-neutral-gray/70 mt-1">{timeAgo}</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 shrink-0 mt-1">
            <AnimatePresence>
              {!notification.isRead && (
                <motion.span
                  key="dot"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-2 h-2 rounded-full bg-accent-orange"
                />
              )}
            </AnimatePresence>
            {notification.referenceId && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            )}
          </div>
        </div>

        {/* Delete button — hidden until swiped */}
        <div
          className="w-20 shrink-0 bg-red-500 flex flex-col items-center justify-center gap-1 cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2 className="w-5 h-5 text-white" />
          <span className="text-[10px] font-medium text-white">Delete</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
