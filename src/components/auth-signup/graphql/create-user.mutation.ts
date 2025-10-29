import { graphql } from '@/commons/graphql';

export const CREATE_USER_MUTATION = graphql(`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      _id
    }
  }
`);
