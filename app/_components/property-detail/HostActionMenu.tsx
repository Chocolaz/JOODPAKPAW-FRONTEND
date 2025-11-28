'use client'

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import { Menu, Pencil, Trash2, ChevronLeft } from 'lucide-react'

interface HostActionMenuProps {
  onEditClick?: () => void
  onDeleteClick?: () => void
}

export function HostActionMenu({
  onEditClick,
  onDeleteClick,
}: HostActionMenuProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-gray-100 transition">
          <Menu className="w-5 h-5 text-gray-800" />
        </button>
      </DrawerTrigger>
      <DrawerContent aria-describedby={undefined}>
        <DrawerHeader>
          <div className="flex items-center">
            <DrawerTitle className="grow text-start px-2">Menu</DrawerTitle>
          </div>
        </DrawerHeader>
        <div className="px-4">
          <div className="flex flex-col space-y-2 mb-4">
            {onEditClick && (
              <DrawerClose asChild>
                <button
                  onClick={onEditClick}
                  className="flex items-center gap-3 p-2 rounded-lg border-b hover:bg-gray-100 transition text-left"
                >
                  <Pencil className="w-5 h-5 text-gray-700" />
                  <span>Edit</span>
                </button>
              </DrawerClose>
            )}
            {onDeleteClick && (
              <DrawerClose asChild>
                <button
                  onClick={onDeleteClick}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-100/50 transition text-left"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <span className="text-red-500">Delete</span>
                </button>
              </DrawerClose>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
