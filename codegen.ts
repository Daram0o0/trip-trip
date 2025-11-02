import type { CodegenConfig } from '@graphql-codegen/cli';

const GRAPHQL_ENDPOINT = 'https://main-practice.codebootcamp.co.kr/graphql';

const config: CodegenConfig = {
  overwrite: true,
  schema: GRAPHQL_ENDPOINT,
  documents: ['src/**/*.{ts,tsx,graphql,gql}'],
  ignoreNoDocuments: true,
  generates: {
    './src/commons/graphql/': {
      preset: 'client',
    },
    './src/commons/graphql/react-query-hooks.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        fetcher: {
          endpoint: GRAPHQL_ENDPOINT,
          fetchParams: JSON.stringify({
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        },
        exposeQueryKeys: true,
        exposeFetcher: true,
        addSuspenseQuery: true,
        reactQueryVersion: 5,
      },
    },
  },
};

export default config;
