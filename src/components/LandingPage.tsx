import React from 'react';
import { motion } from 'motion/react';
import { Wand2, Sparkles, BookOpen, Play } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onShowRules: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onShowRules }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Magical Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D3A625]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#740001]/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        {/* Logo/Title Area */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <div className="relative">
            <Wand2 className="w-20 h-20 text-[#D3A625] mb-4 drop-shadow-[0_0_15px_rgba(211,166,37,0.6)]" />
            <motion.div
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="text-[#D3A625] w-6 h-6" />
            </motion.div>
          </div>
        </motion.div>

        <h1 className="text-5xl sm:text-7xl font-serif font-bold text-[#D3A625] tracking-[0.2em] uppercase mb-4 drop-shadow-2xl">
          Crazy Eights
        </h1>
        <p className="text-[#D3A625]/60 font-serif tracking-[0.5em] uppercase text-sm mb-12">
          Wizarding World Edition
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(211,166,37,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[#D3A625] text-[#1a0f0a] rounded-full font-bold uppercase tracking-widest transition-all shadow-xl group"
          >
            <Play className="w-5 h-5 fill-current" />
            Enter Hogwarts
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onShowRules}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 border-2 border-[#D3A625]/40 text-[#D3A625] rounded-full font-bold uppercase tracking-widest transition-all backdrop-blur-sm"
          >
            <BookOpen className="w-5 h-5" />
            Spellbook
          </motion.button>
        </div>

        <div className="mt-16 pt-8 border-t border-[#D3A625]/10 w-full">
          <p className="text-stone-500 text-xs font-serif uppercase tracking-widest">
            A Magical Card Game for Aspiring Wizards
          </p>
        </div>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#D3A625]/30 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
          }}
          animate={{ 
            y: [null, "-100%"],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 15 + 10, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>
  );
};
