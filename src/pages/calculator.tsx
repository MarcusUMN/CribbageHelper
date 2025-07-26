import React from 'react';
import { ParsedUrlQuery } from 'querystring';
import { Calculator} from '../components/Calculator';

export type CalculaterProps = {
  initialQueryParams : ParsedUrlQuery;
};

export default function ({ initialQueryParams }: CalculaterProps) {
    return <Calculator initialQueryParams = {initialQueryParams}/>;
} 

export async function getServerSideProps(context: { query: ParsedUrlQuery }) {
  const initialQueryParams = context.query;
  return {
    props: {
      initialQueryParams
    },
  };
}
