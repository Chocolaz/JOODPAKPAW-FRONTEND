'use client'

export const ErrorState = ({ error }: { error: string }) => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-red-500">{error}</p>
  </div>
)
