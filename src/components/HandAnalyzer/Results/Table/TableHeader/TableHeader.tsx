import {
  Table as MantineTable,
  Group,
  Text,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconArrowsVertical } from '@tabler/icons-react';
import classes from '../Table.module.css';
import { SortKey, StatKey, stats, headers } from '../types'

const SortButton = ({ direction }: { direction: 'asc' | 'desc' | null }) => {
  if (direction === 'asc') return <IconChevronUp size={14} />;
  if (direction === 'desc') return <IconChevronDown size={14} />;
  return <IconArrowsVertical size={14} />;
};

export const TableHeader = ({
  sortBy,
  sortDirection,
  onSortChange,
  visibleStats,
  isMyCrib,
}: {
  sortBy: SortKey;
  sortDirection: 'asc' | 'desc';
  onSortChange: (key: SortKey) => void;
  visibleStats: Set<'avg' | 'min'>;
  isMyCrib: boolean;
}) => {
  const renderHeaderCell = (label: string, key: SortKey, withBorder = false) => {
    const active = sortBy === key;
    return (
      <MantineTable.Th
        key={key}
        className={withBorder ? classes.cellBorderLeft : ''}
        style={{ userSelect: 'none', whiteSpace: 'nowrap', textAlign: 'center', cursor: 'pointer' }}
        onClick={() => onSortChange(key)}
      >
        <Group justify="center" gap={4} wrap="nowrap">
          <Text fw={700} size="xs" c="#555">{label}</Text>
          <SortButton direction={active ? sortDirection : null} />
        </Group>
      </MantineTable.Th>
    );
  };

  const dynamicHeaders = headers.map(({ label, key, colSpan }) => {
    if (key === 'combined') {
      return {
        label: isMyCrib ? 'Hand + Crib' : 'Hand - Crib',
        key,
        colSpan,
      };
    }
    return { label, key, colSpan };
  });

  return (
    <MantineTable.Thead>
      <MantineTable.Tr>
        <MantineTable.Th rowSpan={2} className={classes.discardCell}>Discards</MantineTable.Th>
        {dynamicHeaders.map(({ label, key }) => (
          <MantineTable.Th
            key={key}
            colSpan={visibleStats.size}
            className={classes.groupHeader}
            style={{ textAlign: 'center' }}
          >
            {label}
          </MantineTable.Th>
        ))}
      </MantineTable.Tr>
      <MantineTable.Tr>
        {dynamicHeaders.flatMap(({ key: catKey }) =>
          stats
            .filter(({ key: statKey }) => visibleStats.has(statKey as StatKey))
            .map(({ label, key: statKey }, j) =>
              renderHeaderCell(label, `${catKey}_${statKey}` as SortKey, j === 0)
            )
        )}
      </MantineTable.Tr>
    </MantineTable.Thead>
  );
};
