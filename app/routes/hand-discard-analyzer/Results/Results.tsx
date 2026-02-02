import { useLoaderData, useNavigate } from 'react-router';
import { Tabs, Button, Group, Badge } from '@mantine/core';
import {
  IconTableFilled,
  IconCirclePercentageFilled
} from '@tabler/icons-react';
import { FormatCard } from '../../../ui/FormatCard';
import { PageContainer } from '../../../ui/PageContainer';
import { Stats } from './Stats';
import { Probabilities } from './Probabilities';

type LoaderData = {
  result: any[];
  handKey: string;
  isMyCrib: boolean;
};

export const Results = () => {
  const navigate = useNavigate();
  const { result, handKey, isMyCrib } = useLoaderData() as LoaderData;

  return (
    <PageContainer
      title="RESULTS"
      titleRight={
        <Badge color={isMyCrib ? 'green' : 'gray'} variant="light" size="lg">
          {isMyCrib ? 'Your Crib' : "Opponent's Crib"}
        </Badge>
      }
      maxPageWidth="800px"
      bottomLeft={
        <Group>
          {handKey.split('-').map((cardStr, idx) => {
            const rank = cardStr.slice(0, -1);
            const suit = cardStr.slice(-1) as 'S' | 'H' | 'D' | 'C';
            return (
              <FormatCard key={idx} rank={rank} suit={suit} iconSize={20} />
            );
          })}
        </Group>
      }
      bottomRight={
        <Button onClick={() => navigate('/hand-discard-analyzer')}>
          New hand
        </Button>
      }
    >
      <Tabs variant="pills" defaultValue="stats">
        <Tabs.List>
          <Tabs.Tab value="stats" leftSection={<IconTableFilled size={12} />}>
            Stats
          </Tabs.Tab>
          <Tabs.Tab
            value="probabilities"
            leftSection={<IconCirclePercentageFilled size={12} />}
          >
            Probabilities
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="stats">
          <Stats hands={result} isMyCrib={isMyCrib} />
        </Tabs.Panel>
        <Tabs.Panel value="probabilities">
          <Probabilities hands={result} isMyCrib={isMyCrib} />
        </Tabs.Panel>
      </Tabs>
    </PageContainer>
  );
};
