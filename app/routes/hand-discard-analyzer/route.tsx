import { LoaderFunctionArgs } from 'react-router';
import { HandDiscardAnalyzer } from './HandDiscardAnalyzer';
import { createMeta } from '../../tools/meta';
import { evaluateHand } from '../../cribbage';

export const meta = () =>
  createMeta({
    title: 'Hand Discard Analyzer',
    description:
      'Analyze your 6-card hand and discover the optimal cards to keep or discard.'
  });

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const handKey = url.searchParams.get('data');
  const cribParam = url.searchParams.get('crib');

  if (!handKey) {
    return null;
  }

  const isMyCrib = cribParam === 'Y';

  const result = evaluateHand(handKey, isMyCrib);

  return {
    handKey,
    isMyCrib,
    result
  };
}

export default HandDiscardAnalyzer;
