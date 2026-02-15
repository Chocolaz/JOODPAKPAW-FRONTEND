'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function AddPropertyPage() {
  return (
    <div className="flex flex-col items-center h-full px-5 max-w-[500px] mx-auto">
      <div className="flex flex-col mt-10 pb-24">
        {' '}
        {/* เพิ่ม pb-24 กันปุ่มบังเนื้อหา */}
        <h1 className="text-2xl font-bold mb-6 text-deep-teal">
          Become a Host
        </h1>
        <div className="space-y-8 text-left">
          {/* Section 1: Tell us about your space */}
          <div className="border-b border-black/10 pb-8 flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 text-deep-teal">
                Tell us about your space
              </h3>
              <p className="text-[14px]">
                Share details about your home and environment
                <br /> so pet owners know exactly what to expect.
              </p>
            </div>
            <div className="shrink-0">
              <Image
                src="/graphics/steps/tell-us.svg"
                alt="Tell us about your space"
                width={80}
                height={80}
              />
            </div>
          </div>

          {/* Section 2: Make it stand out */}
          <div className="border-b border-black/10 pb-8 flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 text-deep-teal">
                Make it stand out
              </h3>
              <p className="text-[14px]">
                Highlight what makes your space special. <br />
                Features and photos to attract more furry guests!
              </p>
            </div>
            <div className="shrink-0">
              <Image
                src="/graphics/steps/make-it.svg"
                alt="Make it stand out"
                width={80}
                height={80}
              />
            </div>
          </div>

          {/* Section 3: Publish Your Listing */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 text-deep-teal">
                Publish Your Listing
              </h3>
              <p className="text-[14px]">
                Go live and welcome pets to stay! <br /> You can always update
                your listing anytime.
              </p>
            </div>
            <div className="shrink-0">
              <Image
                src="/graphics/steps/publish.svg"
                alt="Publish Your Listing"
                width={80}
                height={80}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-0 right-0 bg-white py-5 px-10 z-10 max-w-[500px] mx-auto">
        <Link href="/profile/host/add-property/1" className="w-full">
          <Button className="interact-button bg-accent-orange! w-full">
            Start
          </Button>
        </Link>
      </div>
    </div>
  )
}
