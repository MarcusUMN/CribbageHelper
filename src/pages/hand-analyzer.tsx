import React from 'react';
import { HandAnalyzer } from '../components/HandAnalyzer';
import { ParsedUrlQuery } from 'querystring';

export type HandAnalyzerProps = {
  initialQueryParams : ParsedUrlQuery;
};

export default function ({ initialQueryParams }: HandAnalyzerProps) {
  return <HandAnalyzer initialQueryParams ={initialQueryParams } />;
}

export async function getServerSideProps(context: { query: ParsedUrlQuery }) {
  const initialQueryParams  = context.query;

  return {
    props: {
      initialQueryParams ,
    },
  };
}
