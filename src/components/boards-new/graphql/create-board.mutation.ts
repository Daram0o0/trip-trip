import { graphql } from '@/commons/graphql';

export const CREATE_BOARD_MUTATION = graphql(`
  mutation CreateBoard($createBoardInput: CreateBoardInput!) {
    createBoard(createBoardInput: $createBoardInput) {
      _id
    }
  }
`);
