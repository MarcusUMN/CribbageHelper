import { evaluateSixCardHand } from '../../../utils';

self.onmessage = (event) => {
  const { handKey, isMyCrib } = event.data;
  const result = evaluateSixCardHand(handKey, isMyCrib);
  self.postMessage(result);
};
