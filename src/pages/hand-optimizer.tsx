import React from 'react';
import { ParsedUrlQuery } from 'querystring';
import { HandOptimizer } from '../components/HandOptimizer';

export type HandOptimizerProps = {
  initialQueryParams : ParsedUrlQuery;
};

export default function ({ initialQueryParams }: HandOptimizerProps) {
  return <HandOptimizer initialQueryParams = {initialQueryParams}/>;
}

export async function getServerSideProps(context: { query: ParsedUrlQuery }) {
  const initialQueryParams = context.query;
  return {
    props: {
      initialQueryParams
    },
  };
}
