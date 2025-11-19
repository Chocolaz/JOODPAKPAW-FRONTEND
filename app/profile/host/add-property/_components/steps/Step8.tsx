'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Step8() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-2xl font-bold mb-4">Congratulations!</h1>
      <p>Your property has been listed successfully.</p>
      <Link href="/profile/host">
        <Button className="mt-6">Go to Host Dashboard</Button>
      </Link>
    </div>
  )
}
