import { LoaderFunctionArgs } from 'react-router';
import { HandOptimizer } from './HandOptimizer';
import { createMeta } from '../../tools/meta';
import { evaluateSixCardHand } from '../../cribbage';

export const meta = () =>
  createMeta({
    title: 'Hand Optimizer',
    description:
      'Analyze your 6-card hand and discover the optimal 4 cards to keep.'
  });

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const handKey = url.searchParams.get('data');
  const cribParam = url.searchParams.get('crib');

  if (!handKey) {
    return null;
  }

  const isMyCrib = cribParam === 'Y';

  const result = evaluateSixCardHand(handKey, isMyCrib);

  return {
    handKey,
    isMyCrib,
    result
  };
}

export default HandOptimizer;
