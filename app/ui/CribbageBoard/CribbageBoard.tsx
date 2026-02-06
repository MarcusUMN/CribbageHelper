import React, { useMemo } from 'react';
import { Box } from '@mantine/core';
import { Player } from '../../routes/pegboard';

const HOLES_PER_ROW = 24;
const COL_SPACING = 12.5;
const ROW_SPACING = 75;
const PAD_X = 35;
const PAD_Y = 40;
const TOTAL_HOLES = 120;

export const CribbageBoard = ({ players }: { players: Player[] }) => {
  const getCoords = (i: number, playerIndex: number, totalPlayers: number) => {
    const isFinish = i >= TOTAL_HOLES;
    const idx = isFinish ? TOTAL_HOLES - 1 : i;
    const rowIndex = Math.floor(idx / HOLES_PER_ROW);
    const localIdx = idx % HOLES_PER_ROW;
    const isReverse = rowIndex % 2 !== 0;

    const xBase = isReverse
      ? PAD_X + (HOLES_PER_ROW - 1 - localIdx) * COL_SPACING
      : PAD_X + localIdx * COL_SPACING;

    const yBase = PAD_Y + rowIndex * ROW_SPACING;

    const spread = 18;
    const offset = isFinish
      ? 0
      : (playerIndex - (totalPlayers - 1) / 2) * spread;

    return {
      x: isFinish ? xBase + 25 : xBase,
      y: yBase + offset,
      isReverse,
      rowIndex
    };
  };

  const tracks = useMemo(() => {
    return players.map((_, pIdx) =>
      Array.from({ length: TOTAL_HOLES + 1 }, (_, i) =>
        getCoords(i, pIdx, players.length)
      )
    );
  }, [players.length]);

  const viewWidth = (HOLES_PER_ROW - 1) * COL_SPACING + PAD_X * 2 + 30;
  const viewHeight = 4 * ROW_SPACING + PAD_Y * 2;

  const renderPath = (playerIdx: number) => {
    const points = tracks[playerIdx]
      .slice(0, TOTAL_HOLES + 1)
      .map((p) => `${p.x},${p.y}`)
      .join(' L ');
    return `M ${points}`;
  };

  return (
    <Box
      bg="#3e2723"
      p={8}
      style={{
        flex: 1,
        height: 400,
        borderRadius: 12,
        boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
      }}
    >
      <Box
        style={{
          borderRadius: 8,
          background: 'linear-gradient(135deg, #e3bc91 0%, #b88a5d 100%)',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <svg
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '380px',
            overflow: 'visible'
          }}
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {players.map((_, pIdx) => (
            <path
              key={`path-${pIdx}`}
              d={renderPath(pIdx)}
              fill="none"
              stroke="#1a0f08"
              strokeWidth={1}
              strokeOpacity={0.15}
              strokeDasharray="4 2"
            />
          ))}

          {tracks[0].slice(0, TOTAL_HOLES).map((_, i) => {
            return (
              <React.Fragment key={i}>
                {tracks.map((track, pIdx) => (
                  <circle
                    key={`${pIdx}-${i}`}
                    cx={track[i].x}
                    cy={track[i].y}
                    r={2}
                    fill="#1a0f08"
                    opacity={0.3}
                  />
                ))}
              </React.Fragment>
            );
          })}

          <circle
            cx={tracks[0][TOTAL_HOLES].x}
            cy={tracks[0][TOTAL_HOLES].y}
            r={5}
            fill="#1a0f08"
          />
          <text
            x={tracks[0][TOTAL_HOLES].x}
            y={tracks[0][TOTAL_HOLES].y - 12}
            fontSize="8"
            fontWeight="900"
            fill="#1a0f08"
            textAnchor="middle"
          >
            WIN
          </text>
          {players.map((player, pIdx) => {
            const pos = Math.min(Math.max(player.score, 0), TOTAL_HOLES);
            const p = tracks[pIdx][pos];
            return (
              <circle
                key={player.id}
                cx={p.x}
                cy={p.y}
                r={7.5}
                fill={player.color}
                stroke="rgba(0,0,0,0.8)"
                strokeWidth={1}
                style={{
                  transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: 'drop-shadow(0px 3px 4px rgba(0,0,0,0.5))'
                }}
              />
            );
          })}
        </svg>
      </Box>
    </Box>
  );
};
