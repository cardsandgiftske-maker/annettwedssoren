import React from 'react';
import { motion } from 'motion/react';

interface CrestProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export default function Crest({ size = 'md', animated = true }: CrestProps) {
  const sizeClasses = {
    sm: 'w-24 h-22 text-xl',
    md: 'w-40 h-36 text-3xl',
    lg: 'w-56 h-50 text-5xl',
    xl: 'w-72 h-64 text-6xl',
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const CrestContent = (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} select-none`} id="wedding-crest-container">
      {/* Delicate Champagne Gold / Botanical Green Glow Effect */}
      <div className="absolute inset-x-4 inset-y-2 rounded-full bg-gold-300/30 blur-2xl" />

      <svg
        viewBox="0 0 200 180"
        className="absolute inset-0 w-full h-full text-[#1B4D3E]"
        fill="none"
        id="wedding-crest-svg"
      >
        {/* Monogram Letters (A & S for Annett & Søren) with Interlocking Wedding Rings between them */}
        {animated ? (
          <motion.g variants={textVariants}>
            <text
              x="48"
              y="98"
              textAnchor="middle"
              className="font-serif font-bold select-none fill-current text-[#1B4D3E]"
              style={{ fontSize: '62px' }}
            >
              A
            </text>

            {/* Interlocking Wedding Rings Element in Champagne Gold */}
            <g className="text-[#D4AF37]">
              {/* Left Ring */}
              <circle cx="92" cy="78" r="12" stroke="currentColor" strokeWidth="2.4" fill="none" />
              {/* Right Ring */}
              <circle cx="108" cy="78" r="12" stroke="currentColor" strokeWidth="2.4" fill="none" />
              {/* Interlocking Overlap */}
              <path d="M 97 68 A 12 12 0 0 1 103 80" stroke="currentColor" strokeWidth="2.4" fill="none" />
              {/* Diamond Gem Accent on top of right ring */}
              <path d="M 108 60 L 112 64.5 L 108 69 L 104 64.5 Z" fill="currentColor" />
            </g>

            <text
              x="152"
              y="98"
              textAnchor="middle"
              className="font-serif font-bold select-none fill-current text-[#1B4D3E]"
              style={{ fontSize: '62px' }}
            >
              S
            </text>
          </motion.g>
        ) : (
          <g>
            <text
              x="48"
              y="98"
              textAnchor="middle"
              className="font-serif font-bold select-none fill-current text-[#1B4D3E]"
              style={{ fontSize: '62px' }}
            >
              A
            </text>

            {/* Interlocking Wedding Rings Element in Champagne Gold */}
            <g className="text-[#D4AF37]">
              {/* Left Ring */}
              <circle cx="92" cy="78" r="12" stroke="currentColor" strokeWidth="2.4" fill="none" />
              {/* Right Ring */}
              <circle cx="108" cy="78" r="12" stroke="currentColor" strokeWidth="2.4" fill="none" />
              {/* Interlocking Overlap */}
              <path d="M 97 68 A 12 12 0 0 1 103 80" stroke="currentColor" strokeWidth="2.4" fill="none" />
              {/* Diamond Gem Accent on top of right ring */}
              <path d="M 108 60 L 112 64.5 L 108 69 L 104 64.5 Z" fill="currentColor" />
            </g>

            <text
              x="152"
              y="98"
              textAnchor="middle"
              className="font-serif font-bold select-none fill-current text-[#1B4D3E]"
              style={{ fontSize: '62px' }}
            >
              S
            </text>
          </g>
        )}
      </svg>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="flex items-center justify-center"
      >
        {CrestContent}
      </motion.div>
    );
  }

  return CrestContent;
}
