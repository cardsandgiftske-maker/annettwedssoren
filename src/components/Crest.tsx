import React from 'react';
import { motion } from 'motion/react';

interface CrestProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export default function Crest({ size = 'lg', animated = true }: CrestProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48 md:w-56 md:h-56',
    xl: 'w-56 h-56 md:w-64 md:h-64',
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 6 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      initial={animated ? "hidden" : false}
      whileInView={animated ? "visible" : false}
      viewport={{ once: true, margin: '-40px' }}
      variants={containerVariants}
      className={`relative flex items-center justify-center ${sizeClasses[size]} select-none mx-auto`}
      id="wedding-crest-container"
    >
      <svg
        viewBox="0 0 260 260"
        className="w-full h-full drop-shadow-[0_4px_16px_rgba(107,23,37,0.14)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="wedding-monogram-svg"
      >
        <defs>
          {/* Metallic Gold Gradients Matching Wax Seal */}
          <linearGradient id="crest-gold-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2C6" />
            <stop offset="30%" stopColor="#E2C062" />
            <stop offset="70%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#855802" />
          </linearGradient>

          <linearGradient id="crest-gold-secondary" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C9A227" />
            <stop offset="50%" stopColor="#F5D77F" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>

        {/* ========================================================
            GOLDEN CIRCLE AROUND THE CREST (MATCHING WAX SEAL)
            ======================================================== */}
        
        {/* Outer Golden Circle Ring */}
        <circle
          cx="130"
          cy="130"
          r="122"
          stroke="url(#crest-gold-primary)"
          strokeWidth="3.5"
          className="drop-shadow-[0_1px_3px_rgba(133,88,2,0.3)]"
        />

        {/* Fine Inner Concentric Gold Ring */}
        <circle
          cx="130"
          cy="130"
          r="114"
          stroke="url(#crest-gold-secondary)"
          strokeWidth="1.2"
          opacity="0.85"
        />

        {/* ========================================================
            "A&S" MONOGRAM (SAME SERIF ITALIC AS ON THE WAX SEAL)
            WITH BOTANICAL FLOWER BENEATH
            Color: Deep Emerald Forest Green (#14532D)
            ======================================================== */}

        {/* 1. A&S TYPOGRAPHY (ANNETT & SØREN) */}
        <g fill="#14532D">
          <text
            x="130"
            y="110"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#14532D"
            className="font-serif"
            style={{
              fontFamily: "'Playfair Display', 'Bodoni MT', 'Didot', Georgia, serif",
              fontSize: '66px',
              fontWeight: '700',
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
            }}
          >
            A&amp;S
          </text>
        </g>

        {/* 2. DELICATE BOTANICAL FLOWER & SPRIG BENEATH THE "A&S" */}
        <g stroke="#14532D" fill="#14532D">
          {/* Central Stem Lines branching left and right */}
          <path
            d="M 130 156 C 112 156, 90 153, 62 150"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 130 156 C 148 156, 170 153, 198 150"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* --- CENTER BOTANICAL BLOSSOM / FLOWER --- */}
          {/* Flower Center Pistil */}
          <circle cx="130" cy="156" r="2.6" stroke="none" />

          {/* Petal Top */}
          <path
            d="M 130 152 C 126 145, 134 145, 130 152 Z"
            strokeWidth="0.8"
          />
          {/* Petal Bottom */}
          <path
            d="M 130 160 C 126 167, 134 167, 130 160 Z"
            strokeWidth="0.8"
          />
          {/* Petal Left */}
          <path
            d="M 126 156 C 119 152, 119 160, 126 156 Z"
            strokeWidth="0.8"
          />
          {/* Petal Right */}
          <path
            d="M 134 156 C 141 152, 141 160, 134 156 Z"
            strokeWidth="0.8"
          />

          {/* Accent Dots */}
          <circle cx="126" cy="152" r="1.1" stroke="none" />
          <circle cx="134" cy="152" r="1.1" stroke="none" />
          <circle cx="126" cy="160" r="1.1" stroke="none" />
          <circle cx="134" cy="160" r="1.1" stroke="none" />

          {/* --- LEFT FOLIAGE SPRIG --- */}
          {/* Leaf 1 (Left Upper) */}
          <path
            d="M 112 155 C 106 149, 99 148, 92 150 C 98 155, 105 156, 112 155 Z"
            strokeWidth="0.5"
          />
          {/* Leaf 2 (Left Lower) */}
          <path
            d="M 102 154 C 97 160, 90 161, 83 159 C 89 154, 96 153, 102 154 Z"
            strokeWidth="0.5"
          />
          {/* Leaf 3 (Left End Leaf) */}
          <path
            d="M 76 152 C 68 147, 61 148, 54 150 C 61 153, 69 154, 76 152 Z"
            strokeWidth="0.5"
          />
          {/* Left Leaflet Buds */}
          <circle cx="78" cy="148" r="1.4" stroke="none" />
          <circle cx="52" cy="150" r="1.5" stroke="none" />

          {/* --- RIGHT FOLIAGE SPRIG --- */}
          {/* Leaf 1 (Right Upper) */}
          <path
            d="M 148 155 C 154 149, 161 148, 168 150 C 162 155, 155 156, 148 155 Z"
            strokeWidth="0.5"
          />
          {/* Leaf 2 (Right Lower) */}
          <path
            d="M 158 154 C 163 160, 170 161, 177 159 C 171 154, 164 153, 158 154 Z"
            strokeWidth="0.5"
          />
          {/* Leaf 3 (Right End Leaf) */}
          <path
            d="M 184 152 C 192 147, 199 148, 206 150 C 199 153, 191 154, 184 152 Z"
            strokeWidth="0.5"
          />
          {/* Right Leaflet Buds */}
          <circle cx="182" cy="148" r="1.4" stroke="none" />
          <circle cx="208" cy="150" r="1.5" stroke="none" />
        </g>
      </svg>
    </motion.div>
  );
}





