'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { assetPath } from '@/lib/utils'

const steps = [
  {
    title: 'Tell us about your space',
    description: 'Share details about your home and environment so pet owners know exactly what to expect.',
    image: '/graphics/steps/tell-us.svg',
    alt: 'Tell us about your space',
  },
  {
    title: 'Make it stand out',
    description: 'Highlight what makes your space special. Features and photos to attract more furry guests!',
    image: '/graphics/steps/make-it.svg',
    alt: 'Make it stand out',
  },
  {
    title: 'Publish Your Listing',
    description: 'Go live and welcome pets to stay! You can always update your listing anytime.',
    image: '/graphics/steps/publish.svg',
    alt: 'Publish Your Listing',
  },
]

export default function AddPropertyPage() {
  return (
    <div className="flex flex-col h-full px-5 max-w-[500px] mx-auto">
      <div className="flex flex-col mt-10 pb-28">
        <h1 className="text-2xl font-bold mb-2 text-deep-teal">Become a Host</h1>
        <p className="text-neutral-gray text-sm mb-8">
          It&apos;s simple to get started — just follow three steps.
        </p>

        <div className="space-y-0 text-left">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex items-center justify-between gap-4 py-7 ${
                index < steps.length - 1 ? 'border-b border-black/8' : ''
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1.5 text-deep-teal">{step.title}</h3>
                <p className="text-sm text-neutral-gray leading-relaxed">{step.description}</p>
              </div>
              <div className="shrink-0">
                <Image
                  src={assetPath(step.image)}
                  alt={step.alt}
                  width={72}
                  height={72}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-2 left-0 right-0 bg-white border-t border-gray-100 py-4 px-10 z-10 max-w-[500px] mx-auto">
        <Link href="/profile/host/add-property/1" className="w-full">
          <Button className="interact-button bg-accent-orange! w-full">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  )
}
