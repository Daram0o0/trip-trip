import { graphql } from '@/commons/graphql';

export const LOGIN_USER_MUTATION = graphql(`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      accessToken
    }
  }
`);
