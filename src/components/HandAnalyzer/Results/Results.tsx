import { ParsedUrlQuery } from 'querystring';
import { Tabs, Center, Loader, Button, Group, Title } from '@mantine/core';
import { IconTableFilled } from '@tabler/icons-react';
import { Table } from './Table';
import classes from './Results.module.css';
import { useCachedEvaluation } from '../hooks/useCachedEvaluation';
import { useRouter } from 'next/router';

type Props = {
  queryParams: ParsedUrlQuery;
};

export const Results = ({ queryParams }: Props) => {
  const router = useRouter();
  const handKey = queryParams.data as string | undefined;
  const cribFlag = queryParams.crib as string | undefined;
  const isMyCrib = cribFlag === 'Y';

  if (!handKey) return <div>No hand data provided</div>;

  const { result, loading } = useCachedEvaluation(handKey, isMyCrib);

  if (loading) {
    return (
      <Center mt="xl" style={{ height: '700px' }}>
        <Loader color="blue" size="lg" />
      </Center>
    );
  }

  if (!result || result.length === 0) {
    return <div>No results available.</div>;
  }

  return (
    <div className={classes.wrapper}>
      <Group justify="space-between" mb="md">
        <Title order={3}>RESULTS</Title>
        <Button onClick={() => router.push('/hand-analyzer')}>
          Check new hand
        </Button>
      </Group>
      <Tabs variant="pills" defaultValue="table">
        <Tabs.List>
          <Tabs.Tab value="table" leftSection={<IconTableFilled size={12} />}>
            Table
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="table">
          <Table hands={result} isMyCrib={isMyCrib} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
