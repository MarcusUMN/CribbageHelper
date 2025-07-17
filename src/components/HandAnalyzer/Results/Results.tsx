import { ParsedUrlQuery } from 'querystring';
import { Tabs } from '@mantine/core';
import { IconTableFilled } from '@tabler/icons-react';
import { Table } from './Table';
import classes from './Results.module.css';
import { evaluateSixCardHand } from '../../../utils'

type Props = {
  queryParams: ParsedUrlQuery;
};

export const Results = ({ queryParams }: Props) => {
  const handKey = queryParams.data as string | undefined;  // "2S-3S-4S-5S-6S-AS"
  const cribFlag = queryParams.crib as string | undefined; // Y | N
  const isMyCrib = cribFlag === 'Y';

  if (!handKey) return <div>No hand data provided</div>;

  const evaluationResults = evaluateSixCardHand(handKey, isMyCrib);

  if (!evaluationResults || evaluationResults.length === 0)
    return <div>No results available.</div>;

  return (
    <div className={classes.wrapper}>
      <Tabs variant="pills" defaultValue="table">
        <Tabs.List>
          <Tabs.Tab value="table" leftSection={<IconTableFilled size={12} />}>
            Table
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="table">
          <Table hands={evaluationResults} isMyCrib={isMyCrib} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
