import { graphql } from '@/commons/graphql';

export const UPDATE_BOARD_MUTATION = graphql(`
  mutation UpdateBoard(
    $boardId: ID!
    $password: String!
    $updateBoardInput: UpdateBoardInput!
  ) {
    updateBoard(
      boardId: $boardId
      password: $password
      updateBoardInput: $updateBoardInput
    ) {
      _id
      writer
      title
      contents
      youtubeUrl
      images
      boardAddress {
        zipcode
        address
        addressDetail
      }
      createdAt
      updatedAt
    }
  }
`);
