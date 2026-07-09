'use client'

import { motion } from 'motion/react'

import { RevealStagger, revealItemVariants } from '@/shared/components/common'

interface SectionHeadingProps {
  badge?: string
  title: string
  subtitle?: string
}

/** Centered section header — badge, title and subtitle stagger in on scroll. */
export function SectionHeading({ badge, title, subtitle }: SectionHeadingProps) {
  return (
    <RevealStagger className='mx-auto flex max-w-2xl flex-col items-center text-center' amount={0.6}>
      {badge ? (
        <motion.span
          variants={revealItemVariants}
          className='text-primary/85 border-primary/25 bg-primary/5 mb-4 inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur'
        >
          {badge}
        </motion.span>
      ) : null}
      <motion.h2 variants={revealItemVariants} className='text-heading text-balance'>
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p variants={revealItemVariants} className='text-muted-foreground mt-4 text-base text-pretty'>
          {subtitle}
        </motion.p>
      ) : null}
    </RevealStagger>
  )
}
