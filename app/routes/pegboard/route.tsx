import { createMeta } from '../../tools/meta';
import { Pegboard } from './Pegboard';

export const meta = () =>
  createMeta({
    title: 'Cribbage Pegboard',
    description:
      'A digital cribbage board and score tracker for 2, 3, or 4 players.'
  });

export default Pegboard;
