import {
  Table as MantineTable,
  Group,
  Text,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconArrowsVertical,
} from '@tabler/icons-react';
import classes from './Table.module.css';

type SortDirection = 'asc' | 'desc';

type HeaderGroup = {
  label: string;
  key: string;
  colSpan: number;
};

type StatConfig = {
  label: string;
  key: string;
  sortable?: boolean;
};

const SortButton = ({ direction }: { direction: SortDirection | null }) => {
  if (direction === 'asc') return <IconChevronUp size={14} />;
  if (direction === 'desc') return <IconChevronDown size={14} />;
  return <IconArrowsVertical size={14} />;
};

export const TableHeader = ({
  headers,
  stats,
  sortBy,
  sortDirection,
  onSortChange,
  visibleStats,
  isMyCrib = true,
  groupHeaders = true,
}: {
  headers: HeaderGroup[];
  stats: StatConfig[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (key: string) => void;
  visibleStats: Set<string>;
  isMyCrib?: boolean;
  groupHeaders?: boolean;
}) => {
  const renderHeaderCell = (label: string, key: string, withBorder = false, sortable = true) => {
    const active = sortBy === key;
    return (
      <MantineTable.Th
        key={key}
        className={withBorder ? classes.cellBorderLeft : ''}
        style={{
          userSelect: 'none',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          cursor: sortable ? 'pointer' : 'default',
        }}
        onClick={sortable ? () => onSortChange(key) : undefined}
      >
        <Group justify="center" gap={4} wrap="nowrap">
          <Text fw={700} size="xs" c="#555">
            {label}
          </Text>
          {sortable && <SortButton direction={active ? sortDirection : null} />}
        </Group>
      </MantineTable.Th>
    );
  };

  const dynamicHeaders = headers.map(({ label, key, colSpan }) => ({
    label: key === 'combined' ? (isMyCrib ? 'Hand + Crib' : 'Hand - Crib') : label,
    key,
    colSpan,
  }));

  return (
    <MantineTable.Thead>
      {groupHeaders && (
        <MantineTable.Tr>
          <MantineTable.Th rowSpan={2} className={classes.discardCell}>
            Discards
          </MantineTable.Th>
          {dynamicHeaders.map(({ label, key }) => (
            <MantineTable.Th
              key={key}
              colSpan={Array.from(visibleStats).length}
              className={classes.groupHeader}
              style={{ textAlign: 'center' }}
            >
              {label}
            </MantineTable.Th>
          ))}
        </MantineTable.Tr>
      )}
      <MantineTable.Tr>
        {!groupHeaders && (
          <MantineTable.Th className={classes.discardCell}>Discards</MantineTable.Th>
        )}
        {dynamicHeaders.flatMap(({ key: catKey }) =>
          stats
            .filter(({ key }) => visibleStats.has(key))
            .map(({ label, key: statKey, sortable = true }, j) =>
              renderHeaderCell(
                label,
                `${catKey}_${statKey}`,
                j === 0, 
                sortable
              )
            )
        )}
      </MantineTable.Tr>
    </MantineTable.Thead>
  );
};
