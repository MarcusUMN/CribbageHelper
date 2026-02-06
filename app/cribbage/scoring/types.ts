import { Card } from '../core/deck';

export interface CardScore {
  category: 'Run' | 'Pair' | 'Flush' | 'Fifteen' | 'Nobs';
  points: number;
  cards: Card[];
  label?: string;
}
