import { evaluateSixCardHand } from '../../../cribbage';

self.onmessage = (event) => {
  const { handKey, isMyCrib } = event.data;
  const result = evaluateSixCardHand(handKey, isMyCrib);
  self.postMessage(result);
};
