import { Suit, Rank, CardData } from './types';

export const SUITS: Suit[] = ['Gryffindor', 'Hufflepuff', 'Slytherin', 'Ravenclaw'];
export const RANKS: Rank[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const RANK_NAMES: Record<Rank, string> = {
  '1': 'Year 1',
  '2': 'Year 2',
  '3': 'Year 3',
  '4': 'Year 4',
  '5': 'Year 5',
  '6': 'Year 6',
  '7': 'Year 7',
  '8': 'The Chosen One',
  '9': 'Prefect',
  '10': 'Head Student',
  'J': 'Professor',
  'Q': 'Headmaster',
  'K': 'Founder',
  'A': 'Ancient Magic',
};

export const SUIT_THEMES: Record<Suit, { name: string; color: string; accent: string; icon: string; bg: string }> = {
  Gryffindor: {
    name: 'Gryffindor',
    color: '#740001',
    accent: '#D3A625',
    icon: '🦁',
    bg: 'rgba(116, 0, 1, 0.1)',
  },
  Hufflepuff: {
    name: 'Hufflepuff',
    color: '#ECB939',
    accent: '#372E29',
    icon: '🦡',
    bg: 'rgba(236, 185, 57, 0.1)',
  },
  Slytherin: {
    name: 'Slytherin',
    color: '#1A472A',
    accent: '#5D5D5D',
    icon: '🐍',
    bg: 'rgba(26, 71, 42, 0.1)',
  },
  Ravenclaw: {
    name: 'Ravenclaw',
    color: '#0E1A40',
    accent: '#946B2D',
    icon: '🦅',
    bg: 'rgba(14, 26, 64, 0.1)',
  },
};

export function createDeck(): CardData[] {
  const deck: CardData[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({
        id: `${suit}-${rank}-${Math.random().toString(36).substr(2, 9)}`,
        suit,
        rank,
      });
    });
  });
  return shuffle(deck);
}

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
