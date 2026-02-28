'use client'

import { CheckCheck, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  filteredUnread: number
  onMarkAllRead: () => void
  onClearAll: () => void
}

export function ActionsBar({ filteredUnread, onMarkAllRead, onClearAll }: Props) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100 bg-white">
      <motion.p
        key={filteredUnread}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-xs text-neutral-gray"
      >
        {filteredUnread > 0 ? `${filteredUnread} unread` : 'All caught up'}
      </motion.p>

      <div className="flex items-center gap-4">
        <AnimatePresence>
          {filteredUnread > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs font-medium text-deep-teal hover:opacity-75 transition-opacity"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </motion.button>
          )}
        </AnimatePresence>
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 text-xs font-medium text-red-400 hover:opacity-75 transition-opacity"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>
    </div>
  )
}
