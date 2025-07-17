import { ParsedUrlQuery } from 'querystring';
import { Tabs, Center, Loader } from '@mantine/core';
import { IconTableFilled } from '@tabler/icons-react';
import { Table } from './Table';
import classes from './Results.module.css';
import { useHandEvaluator } from '../hooks/useHandEvaluater';

type Props = {
  queryParams: ParsedUrlQuery;
};

export const Results = ({ queryParams }: Props) => {
  const handKey = queryParams.data as string | undefined;  // e.g. "2S-3S-4S-5S-6S-AS"
  const cribFlag = queryParams.crib as string | undefined; // "Y" | "N"
  const isMyCrib = cribFlag === 'Y';

  if (!handKey) return <div>No hand data provided</div>;

  const cacheKey = `${handKey}-${isMyCrib ? 'Y' : 'N'}`;

  // Try to load cached result from localStorage
  let cachedResult: any[] | null = null;
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        cachedResult = JSON.parse(cached);
      } catch {
        cachedResult = null;
      }
    }
  }

  const { result: evaluationResults, loading } = useHandEvaluator(
    cachedResult ? undefined : handKey,
    isMyCrib
  );

  if (!loading && evaluationResults && !cachedResult && typeof window !== 'undefined') {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(evaluationResults));
    } catch {}
  }

  if (loading && !cachedResult) {
    return (
      <Center mt="xl" style={{ height: '700px' }}>
        <Loader color="blue" size="lg" />
      </Center>
    );
  }

  const resultsToShow = cachedResult ?? evaluationResults;

  if (!resultsToShow || resultsToShow.length === 0)
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
          <Table hands={resultsToShow} isMyCrib={isMyCrib} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
