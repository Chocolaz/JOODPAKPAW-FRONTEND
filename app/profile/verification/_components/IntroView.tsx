'use client'

import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { assetPath } from '@/lib/utils'

export function IntroView({ onStart }: { onStart: () => void }) {
  const benefits = [
    {
      image: '/graphics/benefit-1.png',
      title: 'Build Trust',
      desc: 'A verified badge shows hosts and guests you are who you say you are.',
    },
    {
      image: '/graphics/benefit-2.png',
      title: 'Verified Identity',
      desc: 'Unlock full access to bookings and host features on JoodPakPaw.',
    },
  ]

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col gap-7"
    >
      {/* Hero */}
      <div className="flex justify-center">
        <Image
          src={assetPath('/graphics/verification.png')}
          alt="Identity Verification"
          width={200}
          height={200}
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Benefit cards */}
      <div className="grid grid-cols-2 gap-3">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="bg-white border border-gray-100 rounded-[20px] p-4 flex flex-col items-center text-center gap-3 shadow-sm"
          >
            <Image
              src={assetPath(b.image)}
              alt={b.title}
              width={90}
              height={90}
              className="object-contain"
              unoptimized
            />
            <div>
              <p className="text-sm font-semibold text-deep-teal">{b.title}</p>
              <p className="text-xs text-neutral-gray mt-1 leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* What you'll need */}
      <div className="bg-off-white rounded-[20px] px-4 py-4 flex flex-col gap-3">
        <p className="text-xs font-semibold text-neutral-gray uppercase tracking-wide">
          What you&apos;ll need
        </p>
        <div className="flex flex-col gap-2.5">
          {[
            "A government-issued ID (passport, national ID, or driver's license)",
            'A selfie of yourself holding the ID next to your face',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-deep-teal/10 text-deep-teal text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full py-3.5 rounded-full bg-accent-orange text-white text-sm font-semibold hover:bg-accent-orange/90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
      >
        Get Started
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
