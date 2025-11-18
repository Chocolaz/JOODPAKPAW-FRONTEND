'use client'

import { AddPropertyProvider } from './_context/AddPropertyContext'

export default function AddPropertyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AddPropertyProvider>{children}</AddPropertyProvider>
}
