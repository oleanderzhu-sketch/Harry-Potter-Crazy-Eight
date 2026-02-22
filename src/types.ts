export type Suit = 'Gryffindor' | 'Hufflepuff' | 'Slytherin' | 'Ravenclaw';
export type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type GameStatus = 'playing' | 'choosing_suit' | 'game_over';
export type Turn = 'player' | 'ai';

export interface GameState {
  deck: CardData[];
  playerHand: CardData[];
  aiHand: CardData[];
  discardPile: CardData[];
  currentSuit: Suit;
  currentRank: Rank;
  turn: Turn;
  status: GameStatus;
  winner: Turn | null;
}
