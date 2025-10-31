/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query FetchUserLoggedIn {\n    fetchUserLoggedIn {\n      _id\n      name\n    }\n  }\n": typeof types.FetchUserLoggedInDocument,
    "\n  mutation LoginUser($email: String!, $password: String!) {\n    loginUser(email: $email, password: $password) {\n      accessToken\n    }\n  }\n": typeof types.LoginUserDocument,
    "\n  mutation CreateUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      _id\n    }\n  }\n": typeof types.CreateUserDocument,
    "mutation likeBoard($boardId: ID!) {\n  likeBoard(boardId: $boardId)\n}\n\nmutation dislikeBoard($boardId: ID!) {\n  dislikeBoard(boardId: $boardId)\n}": typeof types.LikeBoardDocument,
    "query fetchBoard($boardId: ID!) {\n  fetchBoard(boardId: $boardId) {\n    _id\n    writer\n    title\n    contents\n    youtubeUrl\n    likeCount\n    dislikeCount\n    images\n    boardAddress {\n      _id\n      zipcode\n      address\n      addressDetail\n    }\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}\n\nquery fetchBoardComments($page: Int, $boardId: ID!) {\n  fetchBoardComments(page: $page, boardId: $boardId) {\n    _id\n    writer\n    contents\n    rating\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}": typeof types.FetchBoardDocument,
    "query fetchBoards($endDate: DateTime, $startDate: DateTime, $search: String, $page: Int) {\n  fetchBoards(\n    endDate: $endDate\n    startDate: $startDate\n    search: $search\n    page: $page\n  ) {\n    _id\n    writer\n    title\n    contents\n    createdAt\n    likeCount\n    images\n  }\n}\n\nquery fetchBoardsCount($endDate: DateTime, $startDate: DateTime, $search: String) {\n  fetchBoardsCount(endDate: $endDate, startDate: $startDate, search: $search)\n}\n\nquery fetchBoardsOfTheBest {\n  fetchBoardsOfTheBest {\n    _id\n    writer\n    title\n    contents\n    youtubeUrl\n    likeCount\n    dislikeCount\n    images\n    boardAddress {\n      _id\n      zipcode\n      address\n      addressDetail\n    }\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}": typeof types.FetchBoardsDocument,
};
const documents: Documents = {
    "\n  query FetchUserLoggedIn {\n    fetchUserLoggedIn {\n      _id\n      name\n    }\n  }\n": types.FetchUserLoggedInDocument,
    "\n  mutation LoginUser($email: String!, $password: String!) {\n    loginUser(email: $email, password: $password) {\n      accessToken\n    }\n  }\n": types.LoginUserDocument,
    "\n  mutation CreateUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      _id\n    }\n  }\n": types.CreateUserDocument,
    "mutation likeBoard($boardId: ID!) {\n  likeBoard(boardId: $boardId)\n}\n\nmutation dislikeBoard($boardId: ID!) {\n  dislikeBoard(boardId: $boardId)\n}": types.LikeBoardDocument,
    "query fetchBoard($boardId: ID!) {\n  fetchBoard(boardId: $boardId) {\n    _id\n    writer\n    title\n    contents\n    youtubeUrl\n    likeCount\n    dislikeCount\n    images\n    boardAddress {\n      _id\n      zipcode\n      address\n      addressDetail\n    }\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}\n\nquery fetchBoardComments($page: Int, $boardId: ID!) {\n  fetchBoardComments(page: $page, boardId: $boardId) {\n    _id\n    writer\n    contents\n    rating\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}": types.FetchBoardDocument,
    "query fetchBoards($endDate: DateTime, $startDate: DateTime, $search: String, $page: Int) {\n  fetchBoards(\n    endDate: $endDate\n    startDate: $startDate\n    search: $search\n    page: $page\n  ) {\n    _id\n    writer\n    title\n    contents\n    createdAt\n    likeCount\n    images\n  }\n}\n\nquery fetchBoardsCount($endDate: DateTime, $startDate: DateTime, $search: String) {\n  fetchBoardsCount(endDate: $endDate, startDate: $startDate, search: $search)\n}\n\nquery fetchBoardsOfTheBest {\n  fetchBoardsOfTheBest {\n    _id\n    writer\n    title\n    contents\n    youtubeUrl\n    likeCount\n    dislikeCount\n    images\n    boardAddress {\n      _id\n      zipcode\n      address\n      addressDetail\n    }\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}": types.FetchBoardsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchUserLoggedIn {\n    fetchUserLoggedIn {\n      _id\n      name\n    }\n  }\n"): (typeof documents)["\n  query FetchUserLoggedIn {\n    fetchUserLoggedIn {\n      _id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginUser($email: String!, $password: String!) {\n    loginUser(email: $email, password: $password) {\n      accessToken\n    }\n  }\n"): (typeof documents)["\n  mutation LoginUser($email: String!, $password: String!) {\n    loginUser(email: $email, password: $password) {\n      accessToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      _id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation likeBoard($boardId: ID!) {\n  likeBoard(boardId: $boardId)\n}\n\nmutation dislikeBoard($boardId: ID!) {\n  dislikeBoard(boardId: $boardId)\n}"): (typeof documents)["mutation likeBoard($boardId: ID!) {\n  likeBoard(boardId: $boardId)\n}\n\nmutation dislikeBoard($boardId: ID!) {\n  dislikeBoard(boardId: $boardId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query fetchBoard($boardId: ID!) {\n  fetchBoard(boardId: $boardId) {\n    _id\n    writer\n    title\n    contents\n    youtubeUrl\n    likeCount\n    dislikeCount\n    images\n    boardAddress {\n      _id\n      zipcode\n      address\n      addressDetail\n    }\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}\n\nquery fetchBoardComments($page: Int, $boardId: ID!) {\n  fetchBoardComments(page: $page, boardId: $boardId) {\n    _id\n    writer\n    contents\n    rating\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}"): (typeof documents)["query fetchBoard($boardId: ID!) {\n  fetchBoard(boardId: $boardId) {\n    _id\n    writer\n    title\n    contents\n    youtubeUrl\n    likeCount\n    dislikeCount\n    images\n    boardAddress {\n      _id\n      zipcode\n      address\n      addressDetail\n    }\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}\n\nquery fetchBoardComments($page: Int, $boardId: ID!) {\n  fetchBoardComments(page: $page, boardId: $boardId) {\n    _id\n    writer\n    contents\n    rating\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query fetchBoards($endDate: DateTime, $startDate: DateTime, $search: String, $page: Int) {\n  fetchBoards(\n    endDate: $endDate\n    startDate: $startDate\n    search: $search\n    page: $page\n  ) {\n    _id\n    writer\n    title\n    contents\n    createdAt\n    likeCount\n    images\n  }\n}\n\nquery fetchBoardsCount($endDate: DateTime, $startDate: DateTime, $search: String) {\n  fetchBoardsCount(endDate: $endDate, startDate: $startDate, search: $search)\n}\n\nquery fetchBoardsOfTheBest {\n  fetchBoardsOfTheBest {\n    _id\n    writer\n    title\n    contents\n    youtubeUrl\n    likeCount\n    dislikeCount\n    images\n    boardAddress {\n      _id\n      zipcode\n      address\n      addressDetail\n    }\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}"): (typeof documents)["query fetchBoards($endDate: DateTime, $startDate: DateTime, $search: String, $page: Int) {\n  fetchBoards(\n    endDate: $endDate\n    startDate: $startDate\n    search: $search\n    page: $page\n  ) {\n    _id\n    writer\n    title\n    contents\n    createdAt\n    likeCount\n    images\n  }\n}\n\nquery fetchBoardsCount($endDate: DateTime, $startDate: DateTime, $search: String) {\n  fetchBoardsCount(endDate: $endDate, startDate: $startDate, search: $search)\n}\n\nquery fetchBoardsOfTheBest {\n  fetchBoardsOfTheBest {\n    _id\n    writer\n    title\n    contents\n    youtubeUrl\n    likeCount\n    dislikeCount\n    images\n    boardAddress {\n      _id\n      zipcode\n      address\n      addressDetail\n    }\n    user {\n      _id\n      email\n      name\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;