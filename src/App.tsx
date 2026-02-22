/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wand2, Trophy, RotateCcw, Info } from 'lucide-react';
import { CardData, Suit, GameStatus, Turn, GameState } from './types';
import { createDeck, SUITS, SUIT_THEMES } from './constants';
import { Card } from './components/Card';
import { LandingPage } from './components/LandingPage';

export default function App() {
  const [view, setView] = useState<'landing' | 'game'>('landing');
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentSuit: 'Gryffindor',
    currentRank: 'A',
    turn: 'player',
    status: 'playing',
    winner: null,
  });

  const [message, setMessage] = useState("Welcome to Hogwarts! Prepare your spells.");
  const [showRules, setShowRules] = useState(false);

  const initGame = useCallback(() => {
    const deck = createDeck();
    const playerHand = deck.splice(0, 8);
    const aiHand = deck.splice(0, 8);
    
    // Find a non-8 card for the start of the discard pile
    let firstCardIndex = deck.findIndex(c => c.rank !== '8');
    if (firstCardIndex === -1) firstCardIndex = 0;
    const discardPile = deck.splice(firstCardIndex, 1);
    
    setGameState({
      deck,
      playerHand,
      aiHand,
      discardPile,
      currentSuit: discardPile[0].suit,
      currentRank: discardPile[0].rank,
      turn: 'player',
      status: 'playing',
      winner: null,
    });
    setMessage("Your turn! Match the suit or rank.");
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const isPlayable = (card: CardData) => {
    if (gameState.status !== 'playing') return false;
    if (card.rank === '8') return true;
    return card.suit === gameState.currentSuit || card.rank === gameState.currentRank;
  };

  const playCard = (card: CardData, isPlayer: boolean) => {
    const newHand = (isPlayer ? gameState.playerHand : gameState.aiHand).filter(c => c.id !== card.id);
    const newDiscardPile = [card, ...gameState.discardPile];
    
    if (card.rank === '8') {
      setGameState(prev => ({
        ...prev,
        [isPlayer ? 'playerHand' : 'aiHand']: newHand,
        discardPile: newDiscardPile,
        status: 'choosing_suit',
        currentRank: '8',
      }));
      if (isPlayer) {
        setMessage("Wild Magic! Choose a new House (Suit).");
      }
    } else {
      const nextTurn = isPlayer ? 'ai' : 'player';
      setGameState(prev => ({
        ...prev,
        [isPlayer ? 'playerHand' : 'aiHand']: newHand,
        discardPile: newDiscardPile,
        currentSuit: card.suit,
        currentRank: card.rank,
        turn: nextTurn,
      }));
      
      if (newHand.length === 0) {
        setGameState(prev => ({ ...prev, status: 'game_over', winner: isPlayer ? 'player' : 'ai' }));
        setMessage(isPlayer ? "Victory! You are the Triwizard Champion!" : "Defeat! The AI has outsmarted you.");
      } else {
        setMessage(isPlayer ? "AI is thinking..." : "Your turn!");
      }
    }
  };

  const drawCard = (isPlayer: boolean) => {
    if (gameState.deck.length === 0) {
      setMessage("The deck is empty! Turn skipped.");
      setGameState(prev => ({ ...prev, turn: isPlayer ? 'ai' : 'player' }));
      return;
    }

    const newDeck = [...gameState.deck];
    const drawnCard = newDeck.pop()!;
    const newHand = [...(isPlayer ? gameState.playerHand : gameState.aiHand), drawnCard];

    setGameState(prev => ({
      ...prev,
      deck: newDeck,
      [isPlayer ? 'playerHand' : 'aiHand']: newHand,
      turn: isPlayer ? 'ai' : 'player',
    }));

    setMessage(isPlayer ? `You drew ${drawnCard.rank} of ${drawnCard.suit}.` : "AI drew a card.");
  };

  // AI Logic
  useEffect(() => {
    if (gameState.turn === 'ai' && gameState.status === 'playing' && !gameState.winner) {
      const timer = setTimeout(() => {
        const playableCards = gameState.aiHand.filter(isPlayable);
        
        if (playableCards.length > 0) {
          // 50% "Magical Fumble" chance: AI might draw even if it has a playable card
          // This balances the game to target a 50% win rate for the player
          const isClumsy = Math.random() > 0.5;
          
          if (isClumsy && gameState.deck.length > 0) {
            drawCard(false);
            setMessage("AI is fumbling with its wand...");
            return;
          }

          // AI plays a card (prefers non-8 if possible)
          const nonEight = playableCards.find(c => c.rank !== '8');
          const cardToPlay = nonEight || playableCards[0];
          
          if (cardToPlay.rank === '8') {
            // AI chooses suit based on most frequent suit in hand
            const suitCounts = gameState.aiHand.reduce((acc, c) => {
              acc[c.suit] = (acc[c.suit] || 0) + 1;
              return acc;
            }, {} as Record<Suit, number>);
            const bestSuit = (Object.keys(suitCounts) as Suit[]).sort((a, b) => suitCounts[b] - suitCounts[a])[0] || 'Hearts';
            
            const newHand = gameState.aiHand.filter(c => c.id !== cardToPlay.id);
            setGameState(prev => ({
              ...prev,
              aiHand: newHand,
              discardPile: [cardToPlay, ...prev.discardPile],
              currentSuit: bestSuit,
              currentRank: '8',
              turn: 'player',
            }));
            setMessage(`AI played an 8 and chose ${SUIT_THEMES[bestSuit].name}!`);
            
            if (newHand.length === 0) {
              setGameState(prev => ({ ...prev, status: 'game_over', winner: 'ai' }));
              setMessage("Defeat! The AI has outsmarted you.");
            }
          } else {
            playCard(cardToPlay, false);
          }
        } else {
          drawCard(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.turn, gameState.status, gameState.aiHand]);

  const handleSuitChoice = (suit: Suit) => {
    setGameState(prev => ({
      ...prev,
      currentSuit: suit,
      status: 'playing',
      turn: 'ai',
    }));
    setMessage(`You chose ${SUIT_THEMES[suit].name}. AI's turn.`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 font-sans select-none">
      {view === 'landing' ? (
        <LandingPage 
          onStart={() => setView('game')} 
          onShowRules={() => setShowRules(true)} 
        />
      ) : (
        <>
          {/* Header */}
          <header className="w-full max-w-5xl flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Wand2 className="text-[#D3A625]" />
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#D3A625] tracking-widest uppercase cursor-pointer" onClick={() => setView('landing')}>
                Crazy Eights
              </h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowRules(true)}
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
              >
                <Info size={20} />
              </button>
              <button 
                onClick={initGame}
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </header>

          {/* AI Hand */}
          <div className="relative w-full flex justify-center h-24 sm:h-32 mb-8">
            <div className="flex -space-x-12 sm:-space-x-16">
              {gameState.aiHand.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card isFaceUp={false} className="scale-75 sm:scale-90" />
                </motion.div>
              ))}
            </div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-900/80 px-4 py-1 rounded-full border border-stone-700 text-xs uppercase tracking-widest text-stone-400">
              Opponent: {gameState.aiHand.length} cards
            </div>
          </div>

          {/* Table Center */}
          <main className="flex-grow flex flex-col items-center justify-center gap-8 w-full max-w-4xl">
            <div className="flex items-center gap-8 sm:gap-16">
              {/* Draw Pile */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-[#D3A625]/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <Card 
                  isFaceUp={false} 
                  onClick={gameState.turn === 'player' ? () => drawCard(true) : undefined}
                  className={gameState.turn === 'player' ? 'magical-glow' : 'opacity-80'}
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-tighter text-stone-500">
                  Deck: {gameState.deck.length}
                </div>
              </div>

              {/* Discard Pile */}
              <div className="relative">
                <AnimatePresence mode="popLayout">
                  {gameState.discardPile[0] && (
                    <motion.div
                      key={gameState.discardPile[0].id}
                      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                    >
                      <Card card={gameState.discardPile[0]} isFaceUp={true} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/80 border border-stone-700">
                    <span className="text-xl">{SUIT_THEMES[gameState.currentSuit].icon}</span>
                    <span className="text-xs font-serif uppercase tracking-widest" style={{ color: SUIT_THEMES[gameState.currentSuit].color }}>
                      {SUIT_THEMES[gameState.currentSuit].name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Board */}
            <div className="mt-12 text-center">
              <motion.p 
                key={message}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-lg sm:text-xl font-serif italic text-stone-300"
              >
                {message}
              </motion.p>
            </div>
          </main>

          {/* Player Hand */}
          <div className="w-full max-w-5xl mt-4 mb-8">
            <div className="flex justify-center -space-x-12 sm:-space-x-16 px-4">
              {gameState.playerHand.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ zIndex: i }}
                >
                  <Card 
                    card={card} 
                    isFaceUp={true} 
                    isPlayable={gameState.turn === 'player' && isPlayable(card)}
                    onClick={() => playCard(card, true)}
                    className="hover:z-50 transition-all"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suit Picker Modal */}
          <AnimatePresence>
            {gameState.status === 'choosing_suit' && (gameState.turn === 'player' || gameState.currentRank === '8') && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="parchment p-8 rounded-3xl max-w-md w-full text-center shadow-2xl border-4 border-[#D3A625]"
                >
                  <h2 className="text-3xl font-serif font-bold mb-6 uppercase tracking-widest">Invoke Your House</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {SUITS.map(suit => (
                      <button
                        key={suit}
                        onClick={() => handleSuitChoice(suit)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-stone-400/30 hover:bg-stone-200/50 transition-all group"
                      >
                        <span className="text-4xl group-hover:scale-125 transition-transform">{SUIT_THEMES[suit].icon}</span>
                        <span className="font-serif font-bold uppercase text-xs tracking-widest" style={{ color: SUIT_THEMES[suit].color }}>
                          {SUIT_THEMES[suit].name}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Over Modal */}
          <AnimatePresence>
            {gameState.status === 'game_over' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
              >
                <motion.div 
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-center"
                >
                  <Trophy className={`w-24 h-24 mx-auto mb-6 ${gameState.winner === 'player' ? 'text-[#D3A625]' : 'text-stone-600'}`} />
                  <h2 className="text-5xl font-serif font-bold mb-4 text-white uppercase tracking-widest">
                    {gameState.winner === 'player' ? 'Champion!' : 'Defeated'}
                  </h2>
                  <p className="text-xl text-stone-400 mb-8 max-w-xs mx-auto">
                    {gameState.winner === 'player' 
                      ? "You have mastered the ancient arts of Crazy Eights." 
                      : "Even the greatest wizards suffer setbacks. Try again."}
                  </p>
                  <button
                    onClick={initGame}
                    className="px-8 py-3 bg-[#D3A625] text-[#1a0f0a] rounded-full font-bold uppercase tracking-widest hover:bg-[#F2C249] transition-colors flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw size={20} />
                    New Game
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Rules Modal (Shared) */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowRules(false)}
          >
            <motion.div 
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="parchment p-8 rounded-3xl max-w-lg w-full shadow-2xl border-4 border-[#D3A625] relative"
            >
              <button 
                onClick={() => setShowRules(false)}
                className="absolute top-4 right-4 text-stone-600 hover:text-stone-900"
              >
                ✕
              </button>
              <h2 className="text-3xl font-serif font-bold mb-6 uppercase tracking-widest text-center">The Wizard's Rules</h2>
              <div className="space-y-4 text-sm sm:text-base">
                <p><strong>Goal:</strong> Be the first to empty your hand of cards.</p>
                <p><strong>Matching:</strong> Play a card that matches the <strong>House</strong> or <strong>Rank</strong> of the top card in the discard pile.</p>
                <p><strong>Crazy 8s:</strong> The number 8 is a wild card. You can play it at any time and choose a new House (Suit).</p>
                <p><strong>Drawing:</strong> If you have no playable cards, you must draw one from the deck. If the deck is empty, your turn is skipped.</p>
                <p><strong>Victory:</strong> The first wizard to cast away all their cards wins the Triwizard Cup!</p>
              </div>
              <button
                onClick={() => setShowRules(false)}
                className="mt-8 w-full py-3 bg-[#2c1810] text-[#f4e4bc] rounded-xl font-bold uppercase tracking-widest hover:bg-[#3d2217] transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D3A625] rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5
            }}
            animate={{ 
              y: [null, "-100%"],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>
    </div>
  );
}
