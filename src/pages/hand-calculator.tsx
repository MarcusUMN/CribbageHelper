import React from 'react';
import { ParsedUrlQuery } from 'querystring';
import { HandCalculator } from '../components/HandCalculator';

export type HandCalculatorProps = {
  initialQueryParams : ParsedUrlQuery;
};

export default function ({ initialQueryParams }: HandCalculatorProps) {
    return <HandCalculator initialQueryParams = {initialQueryParams}/>;
} 

export async function getServerSideProps(context: { query: ParsedUrlQuery }) {
  const initialQueryParams = context.query;
  return {
    props: {
      initialQueryParams
    },
  };
}
