import { index, route, layout } from '@react-router/dev/routes';

const routeFile = (folder: string) => `routes/${folder}/route.tsx`;

export default [
  layout('layout/PageLayout/PageLayout.tsx', [
    index(routeFile('home')),
    route('pegboard', routeFile('pegboard')),
    route('hand-calculator', routeFile('hand-calculator')),
    route('pegging-calculator', routeFile('pegging-calculator')),
    route('hand-discard-analyzer', routeFile('hand-discard-analyzer')),
    route('cut-probabilities', routeFile('cut-probabilities')),
    route('support', routeFile('support'))
  ])
];
