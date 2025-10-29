import { graphql } from '@/commons/graphql';

export const FETCH_USER_LOGGED_IN_QUERY = graphql(`
  query FetchUserLoggedIn {
    fetchUserLoggedIn {
      _id
      name
    }
  }
`);
