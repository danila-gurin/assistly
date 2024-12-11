import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '../../../lib/server/serverClient';
import { gql } from '@apollo/client';

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: NextRequest) {
  const { query, variables } = await request.json();

  try {
    let result;
    if (query.trim().startsWith('mutation')) {
      result = await serverClient.mutate({
        mutation: gql`
          ${query}
        `,
        variables,
      });
    } else {
      result = await serverClient.query({
        query: gql`
          ${query}
        `,
        variables,
      });
    }

    return NextResponse.json({ data: result.data }, { headers: corsHeaders });
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred processing the GraphQL request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
