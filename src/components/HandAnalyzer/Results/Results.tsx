import { ParsedUrlQuery } from 'querystring';
import { Tabs } from '@mantine/core';
import { IconTableFilled } from '@tabler/icons-react';
import dataJson from '../data.json';
import { CribEvaluationResults, SerializedResult } from '../../../../scripts/generateHandEvaluatorData/data/generateData';
import { Table } from './Table';
import classes from './Results.module.css';

const data = dataJson as Record<string, CribEvaluationResults>;

type Props = {
  queryParams: ParsedUrlQuery;
};

export const Results = ({ queryParams }: Props) => {
  const handKey = queryParams.data as string | undefined;
  const cribFlag = queryParams.crib as string | undefined;
  const isMyCrib = cribFlag === 'Y';

  if (!handKey) return <div>No hand data provided</div>;

  const handData = data[handKey];
  if (!handData) return <div>No precomputed data found for hand: {handKey}</div>;

  // cribFlag expected as 'Y' or 'N'
  const hands: SerializedResult[] = cribFlag === 'Y' ? handData.myCrib : handData.opponentCrib;

  if (!hands || hands.length === 0) return <div>No results available.</div>;
  return (
    <div className={classes.wrapper}>
      <Tabs variant="pills" defaultValue="table">
        <Tabs.List>
          <Tabs.Tab value="table" leftSection={<IconTableFilled size={12} />}>
            Table
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="table">
        <Table hands={hands} isMyCrib={isMyCrib} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
