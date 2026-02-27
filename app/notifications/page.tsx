'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  CheckCheck,
  Trash2,
  CheckCircle2,
  XCircle,
  CalendarPlus,
  Star,
  CreditCard,
  Info,
  Wifi,
  WifiOff,
  ChevronRight,
} from 'lucide-react'
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/app/_components/NotificationContext'
import { AppNotification } from '@/types'
import { AppHeader } from '@/app/_components/AppHeader'

// ─────────────────────────────────────────────────────────────────────────────
// Notification type config
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  string,
  { Icon: React.ElementType; color: string; bg: string }
> = {
  booking_confirmed: {
    Icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
  booking_cancelled: {
    Icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-100',
  },
  new_booking: {
    Icon: CalendarPlus,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
  },
  booking_completed: {
    Icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
  review_received: {
    Icon: Star,
    color: 'text-yellow-500',
    bg: 'bg-yellow-100',
  },
  payment: {
    Icon: CreditCard,
    color: 'text-purple-500',
    bg: 'bg-purple-100',
  },
  general: {
    Icon: Info,
    color: 'text-deep-teal',
    bg: 'bg-deep-teal/10',
  },
}

function getTypeConfig(type: string) {
  return (
    TYPE_CONFIG[type] ?? {
      Icon: Bell,
      color: 'text-deep-teal',
      bg: 'bg-deep-teal/10',
    }
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getTimeLabel(date: Date): string {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMMM d, yyyy')
}

function groupByDate(
  notifications: AppNotification[]
): { label: string; items: AppNotification[] }[] {
  const groups: Record<string, AppNotification[]> = {}
  for (const n of notifications) {
    const label = getTimeLabel(new Date(n.receivedAt))
    if (!groups[label]) groups[label] = []
    groups[label].push(n)
  }
  return Object.entries(groups).map(([label, items]) => ({ label, items }))
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: 'easeIn' } },
}

const groupVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}

// ─────────────────────────────────────────────────────────────────────────────
// NotificationItem
// ─────────────────────────────────────────────────────────────────────────────

function NotificationItem({
  notification,
  onRead,
  onDelete,
}: {
  notification: AppNotification
  onRead: (id: string) => void
  onDelete: (id: string) => Promise<void>
}) {
  const router = useRouter()
  const cfg = getTypeConfig(notification.type)
  const { Icon } = cfg
  const timeAgo = formatDistanceToNow(new Date(notification.receivedAt), {
    addSuffix: true,
  })

  const controls = useAnimation()
  const isDragging = useRef(false)
  const isOpen = useRef(false)

  const SWIPE_THRESHOLD = 40
  const DELETE_BTN_WIDTH = 80

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const dragged = info.offset.x
    if (dragged < -SWIPE_THRESHOLD) {
      controls.start({ x: -DELETE_BTN_WIDTH })
      isOpen.current = true
    } else {
      controls.start({ x: 0 })
      isOpen.current = false
    }
    // Let click events settle before clearing drag flag
    setTimeout(() => {
      isDragging.current = false
    }, 50)
  }

  const handleClick = () => {
    if (isDragging.current) return
    // If swiped open, tap closes it
    if (isOpen.current) {
      controls.start({ x: 0 })
      isOpen.current = false
      return
    }
    onRead(notification.id)
    if (notification.actionName === 'booking' && notification.referenceId) {
      if (notification.roleName === 'host') {
        router.push(`/profile/host/booking/${notification.referenceId}`)
      } else {
        router.push(`/profile/bookings/${notification.referenceId}`)
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
      {/* Drag container — card + delete button sit side-by-side, wider than visible area */}
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
          {/* Type icon */}
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5', cfg.bg)}>
            <Icon className={cn('w-5 h-5', cfg.color)} />
          </div>

          {/* Content */}
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

          {/* Right side */}
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
            {notification.actionName === 'booking' && notification.referenceId && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            )}
          </div>
        </div>

        {/* Delete button — sits to the right, hidden until swiped */}
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

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="space-y-4 pt-3">
      {[0, 1].map((g) => (
        <div key={g}>
          <div className="px-4 py-1.5 h-4 w-16 bg-gray-200 rounded animate-pulse mx-4 mb-2" />
          <div className="bg-white rounded-2xl mx-4 overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-100">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteOne,
    clearAll,
  } = useNotifications()

  const grouped = useMemo(() => groupByDate(notifications), [notifications])

  const connectionMenu = (
    <AnimatePresence mode="wait">
      {isConnected !== null && (
        <motion.span
          key={isConnected ? 'on' : 'off'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          className={cn(
            'flex items-center gap-1 text-[11px] font-medium',
            isConnected ? 'text-emerald-500' : 'text-gray-400'
          )}
          title={isConnected ? 'Connected' : 'Disconnected'}
        >
          {isConnected ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5" />
          )}
        </motion.span>
      )}
    </AnimatePresence>
  )

  return (
    <div>
      <AppHeader title="Notifications" menu={connectionMenu} />

      {/* Actions sub-bar */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100 bg-white">
              <motion.p
                key={unreadCount}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-neutral-gray"
              >
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </motion.p>
              <div className="flex items-center gap-4">
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.button
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-xs font-medium text-deep-teal hover:opacity-75 transition-opacity"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </motion.button>
                  )}
                </AnimatePresence>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-xs font-medium text-red-400 hover:opacity-75 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear all
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BODY ──────────────────────────────────────────────────────── */}
      <div className="pb-24">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <NotificationSkeleton />
            </motion.div>
          ) : notifications.length === 0 ? (
            /* Empty state */
            <motion.div
              key="empty"
              variants={emptyVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
                className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <Bell className="w-9 h-9 text-gray-300" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-center space-y-1"
              >
                <p className="font-semibold text-gray-700">
                  No notifications yet
                </p>
                <p className="text-sm text-neutral-gray">
                  You&apos;ll see booking updates and messages here.
                </p>
              </motion.div>
            </motion.div>
          ) : (
            /* Notification list */
            <motion.div
              key="list"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4 pt-3"
            >
              <AnimatePresence>
                {grouped.map(({ label, items }) => (
                  <motion.div
                    key={label}
                    variants={groupVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    {/* Date group label */}
                    <p className="px-4 py-1.5 text-[11px] font-semibold text-neutral-gray uppercase tracking-wider">
                      {label}
                    </p>

                    {/* Cards */}
                    <div className="bg-white rounded-2xl mx-4 overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-100">
                      <AnimatePresence>
                        {items.map((n) => (
                          <NotificationItem
                            key={n.id}
                            notification={n}
                            onRead={markAsRead}
                            onDelete={deleteOne}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
