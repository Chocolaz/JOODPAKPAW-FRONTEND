// app/profile/layout.tsx
import React from 'react'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex flex-col items-center">
      <div className="w-full max-w-[500px] flex flex-col overflow-hidden">
        <h2 className="text-xl font-semibold pt-4 pb-2 mb-2 text-center border-b-2 text-deep-teal">
          Profile
        </h2>
        {children}
      </div>
    </main>
  )
}
