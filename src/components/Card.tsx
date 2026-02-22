import React from 'react';
import { motion } from 'motion/react';
import { CardData, Suit } from '../types';
import { SUIT_THEMES, RANK_NAMES } from '../constants';

interface CardProps {
  card?: CardData;
  isFaceUp: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ card, isFaceUp, onClick, isPlayable, className }) => {
  if (!isFaceUp || !card) {
    return (
      <motion.div
        whileHover={onClick ? { scale: 1.05, y: -10 } : {}}
        onClick={onClick}
        className={`relative w-24 h-36 sm:w-32 sm:h-48 rounded-xl border-4 border-[#D3A625] bg-[#1a0f0a] flex items-center justify-center card-shadow cursor-pointer overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/vintage-wallpaper.png')]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-4xl sm:text-6xl text-[#D3A625] drop-shadow-[0_0_8px_rgba(211,166,37,0.8)]">⚡</div>
          <div className="mt-2 text-[10px] sm:text-xs text-[#D3A625] font-serif tracking-[0.3em] uppercase opacity-60">Hogwarts</div>
        </div>
        {/* Decorative corners */}
        <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-[#D3A625]/40" />
        <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-[#D3A625]/40" />
        <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-[#D3A625]/40" />
        <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-[#D3A625]/40" />
      </motion.div>
    );
  }

  const theme = SUIT_THEMES[card.suit];
  const rankName = RANK_NAMES[card.rank];

  return (
    <motion.div
      layoutId={card.id}
      whileHover={isPlayable ? { scale: 1.05, y: -20 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`relative w-24 h-36 sm:w-32 sm:h-48 rounded-xl border-2 border-[#D3A625]/50 parchment flex flex-col p-2 sm:p-3 card-shadow overflow-hidden ${
        isPlayable ? 'cursor-pointer ring-4 ring-[#D3A625] ring-opacity-50 magical-glow' : 'cursor-default'
      } ${className}`}
    >
      {/* House Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center text-8xl sm:text-9xl">
        {theme.icon}
      </div>

      {/* Top Left Info */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl font-bold font-serif leading-none" style={{ color: theme.color }}>
            {card.rank}
          </span>
          <span className="text-sm sm:text-base">{theme.icon}</span>
        </div>
        <div className="text-[8px] sm:text-[10px] font-serif uppercase tracking-widest opacity-40 text-right">
          {theme.name}
        </div>
      </div>

      {/* Center Illustration Area */}
      <div className="flex-grow flex flex-col items-center justify-center relative z-10 my-1">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-stone-400/30 flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-inner">
          <span className="text-4xl sm:text-5xl drop-shadow-md">
            {card.rank === '8' ? '🪄' : theme.icon}
          </span>
        </div>
        <div className="mt-2 text-[9px] sm:text-[11px] font-serif font-bold uppercase tracking-widest text-center leading-tight" style={{ color: theme.color }}>
          {rankName}
        </div>
      </div>

      {/* Bottom Right Info (Inverted) */}
      <div className="flex justify-between items-end rotate-180 relative z-10">
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl font-bold font-serif leading-none" style={{ color: theme.color }}>
            {card.rank}
          </span>
          <span className="text-sm sm:text-base">{theme.icon}</span>
        </div>
      </div>
      
      {/* Decorative Border */}
      <div className="absolute inset-1 border border-[#D3A625]/20 rounded-lg pointer-events-none" />
      
      {card.rank === '8' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none">
          <div className="px-2 py-0.5 bg-[#D3A625] text-[#1a0f0a] text-[8px] sm:text-[10px] font-bold uppercase tracking-tighter rounded shadow-lg">
            Wild Magic
          </div>
        </div>
      )}
    </motion.div>
  );
};
