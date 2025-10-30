/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useSuspenseQuery, useMutation, UseQueryOptions, UseSuspenseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("http://main-practice.codebootcamp.co.kr/graphql", {
    method: "POST",
    ...({"headers":{"Content-Type":"application/json"}}),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Board = {
  __typename?: 'Board';
  _id: Scalars['ID']['output'];
  boardAddress?: Maybe<BoardAddress>;
  contents: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  dislikeCount: Scalars['Int']['output'];
  images?: Maybe<Array<Scalars['String']['output']>>;
  likeCount: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  writer?: Maybe<Scalars['String']['output']>;
  youtubeUrl?: Maybe<Scalars['String']['output']>;
};

export type BoardAddress = {
  __typename?: 'BoardAddress';
  _id: Scalars['ID']['output'];
  address?: Maybe<Scalars['String']['output']>;
  addressDetail?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  zipcode?: Maybe<Scalars['String']['output']>;
};

export type BoardAddressInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  addressDetail?: InputMaybe<Scalars['String']['input']>;
  zipcode?: InputMaybe<Scalars['String']['input']>;
};

export type BoardComment = {
  __typename?: 'BoardComment';
  _id: Scalars['ID']['output'];
  contents: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  rating: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  writer?: Maybe<Scalars['String']['output']>;
};

export type CreateBoardCommentInput = {
  contents: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Float']['input'];
  writer?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBoardInput = {
  boardAddress?: InputMaybe<BoardAddressInput>;
  contents: Scalars['String']['input'];
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  password?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  writer?: InputMaybe<Scalars['String']['input']>;
  youtubeUrl?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTravelproductInput = {
  contents: Scalars['String']['input'];
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  remarks: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  travelproductAddress?: InputMaybe<TravelproductAddressInput>;
};

export type CreateTravelproductQuestionAnswerInput = {
  contents: Scalars['String']['input'];
};

export type CreateTravelproductQuestionInput = {
  contents: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type FileManager = {
  __typename?: 'FileManager';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  isUsed: Scalars['Boolean']['output'];
  size?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBoard: Board;
  createBoardComment: BoardComment;
  createPointTransactionOfBuyingAndSelling: Travelproduct;
  createPointTransactionOfLoading: PointTransaction;
  createTravelproduct: Travelproduct;
  createTravelproductQuestion: TravelproductQuestion;
  createTravelproductQuestionAnswer: TravelproductQuestionAnswer;
  createUser: User;
  deleteBoard: Scalars['ID']['output'];
  deleteBoardComment: Scalars['ID']['output'];
  deleteBoards: Array<Scalars['ID']['output']>;
  deleteTravelproduct: Scalars['ID']['output'];
  deleteTravelproductQuestion: Scalars['ID']['output'];
  deleteTravelproductQuestionAnswer: Scalars['String']['output'];
  dislikeBoard: Scalars['Int']['output'];
  likeBoard: Scalars['Int']['output'];
  loginUser: Token;
  loginUserExample: Token;
  logoutUser: Scalars['Boolean']['output'];
  resetUserPassword: Scalars['Boolean']['output'];
  restoreAccessToken: Token;
  toggleTravelproductPick: Scalars['Int']['output'];
  updateBoard: Board;
  updateBoardComment: BoardComment;
  updateTravelproduct: Travelproduct;
  updateTravelproductQuestion: TravelproductQuestion;
  updateTravelproductQuestionAnswer: TravelproductQuestionAnswer;
  updateUser: User;
  uploadFile: FileManager;
};


export type MutationCreateBoardArgs = {
  createBoardInput: CreateBoardInput;
};


export type MutationCreateBoardCommentArgs = {
  boardId: Scalars['ID']['input'];
  createBoardCommentInput: CreateBoardCommentInput;
};


export type MutationCreatePointTransactionOfBuyingAndSellingArgs = {
  useritemId: Scalars['ID']['input'];
};


export type MutationCreatePointTransactionOfLoadingArgs = {
  paymentId: Scalars['ID']['input'];
};


export type MutationCreateTravelproductArgs = {
  createTravelproductInput: CreateTravelproductInput;
};


export type MutationCreateTravelproductQuestionArgs = {
  createTravelproductQuestionInput: CreateTravelproductQuestionInput;
  travelproductId: Scalars['ID']['input'];
};


export type MutationCreateTravelproductQuestionAnswerArgs = {
  createTravelproductQuestionAnswerInput: CreateTravelproductQuestionAnswerInput;
  travelproductQuestionId: Scalars['ID']['input'];
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationDeleteBoardArgs = {
  boardId: Scalars['ID']['input'];
};


export type MutationDeleteBoardCommentArgs = {
  boardCommentId: Scalars['ID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteBoardsArgs = {
  boardIds: Array<Scalars['ID']['input']>;
};


export type MutationDeleteTravelproductArgs = {
  travelproductId: Scalars['ID']['input'];
};


export type MutationDeleteTravelproductQuestionArgs = {
  travelproductQuestionId: Scalars['ID']['input'];
};


export type MutationDeleteTravelproductQuestionAnswerArgs = {
  travelproductQuestionAnswerId: Scalars['ID']['input'];
};


export type MutationDislikeBoardArgs = {
  boardId: Scalars['ID']['input'];
};


export type MutationLikeBoardArgs = {
  boardId: Scalars['ID']['input'];
};


export type MutationLoginUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationLoginUserExampleArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationResetUserPasswordArgs = {
  password: Scalars['String']['input'];
};


export type MutationToggleTravelproductPickArgs = {
  travelproductId: Scalars['ID']['input'];
};


export type MutationUpdateBoardArgs = {
  boardId: Scalars['ID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  updateBoardInput: UpdateBoardInput;
};


export type MutationUpdateBoardCommentArgs = {
  boardCommentId: Scalars['ID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  updateBoardCommentInput: UpdateBoardCommentInput;
};


export type MutationUpdateTravelproductArgs = {
  travelproductId: Scalars['ID']['input'];
  updateTravelproductInput: UpdateTravelproductInput;
};


export type MutationUpdateTravelproductQuestionArgs = {
  travelproductQuestionId: Scalars['ID']['input'];
  updateTravelproductQuestionInput: UpdateTravelproductQuestionInput;
};


export type MutationUpdateTravelproductQuestionAnswerArgs = {
  travelproductQuestionAnswerId: Scalars['ID']['input'];
  updateTravelproductQuestionAnswerInput: UpdateTravelproductQuestionAnswerInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload']['input'];
};

export type PointTransaction = {
  __typename?: 'PointTransaction';
  _id: Scalars['ID']['output'];
  amount: Scalars['Int']['output'];
  balance: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  impUid?: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  statusDetail: Scalars['String']['output'];
  travelproduct?: Maybe<Travelproduct>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
};

export type Query = {
  __typename?: 'Query';
  fetchBoard: Board;
  fetchBoardComments: Array<BoardComment>;
  fetchBoards: Array<Board>;
  fetchBoardsCount: Scalars['Int']['output'];
  fetchBoardsCountOfMine: Scalars['Int']['output'];
  fetchBoardsOfMine: Array<Board>;
  fetchBoardsOfTheBest: Array<Board>;
  fetchPointTransactions: Array<PointTransaction>;
  fetchPointTransactionsCountOfBuying: Scalars['Int']['output'];
  fetchPointTransactionsCountOfLoading: Scalars['Int']['output'];
  fetchPointTransactionsCountOfSelling: Scalars['Int']['output'];
  fetchPointTransactionsOfBuying: Array<PointTransaction>;
  fetchPointTransactionsOfLoading: Array<PointTransaction>;
  fetchPointTransactionsOfSelling: Array<PointTransaction>;
  fetchTravelproduct: Travelproduct;
  fetchTravelproductQuestionAnswers: Array<TravelproductQuestionAnswer>;
  fetchTravelproductQuestions: Array<TravelproductQuestion>;
  fetchTravelproducts: Array<Travelproduct>;
  fetchTravelproductsCountIBought: Scalars['Int']['output'];
  fetchTravelproductsCountIPicked: Scalars['Int']['output'];
  fetchTravelproductsCountISold: Scalars['Int']['output'];
  fetchTravelproductsIBought: Array<Travelproduct>;
  fetchTravelproductsIPicked: Array<Travelproduct>;
  fetchTravelproductsISold: Array<Travelproduct>;
  fetchTravelproductsOfTheBest: Array<Travelproduct>;
  fetchUser: User;
  fetchUserLoggedIn: User;
};


export type QueryFetchBoardArgs = {
  boardId: Scalars['ID']['input'];
};


export type QueryFetchBoardCommentsArgs = {
  boardId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFetchBoardsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryFetchBoardsCountArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryFetchPointTransactionsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFetchPointTransactionsOfBuyingArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFetchPointTransactionsOfLoadingArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFetchPointTransactionsOfSellingArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFetchTravelproductArgs = {
  travelproductId: Scalars['ID']['input'];
};


export type QueryFetchTravelproductQuestionAnswersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  travelproductQuestionId: Scalars['ID']['input'];
};


export type QueryFetchTravelproductQuestionsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  travelproductId: Scalars['ID']['input'];
};


export type QueryFetchTravelproductsArgs = {
  isSoldout?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFetchTravelproductsIBoughtArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFetchTravelproductsIPickedArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFetchTravelproductsISoldArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFetchUserArgs = {
  email: Scalars['String']['input'];
};

export type Token = {
  __typename?: 'Token';
  accessToken: Scalars['String']['output'];
};

export type Travelproduct = {
  __typename?: 'Travelproduct';
  _id: Scalars['ID']['output'];
  buyer?: Maybe<User>;
  contents: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  images?: Maybe<Array<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
  pickedCount?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Int']['output']>;
  remarks: Scalars['String']['output'];
  seller?: Maybe<User>;
  soldAt?: Maybe<Scalars['DateTime']['output']>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  travelproductAddress?: Maybe<TravelproductAddress>;
  updatedAt: Scalars['DateTime']['output'];
};

export type TravelproductAddress = {
  __typename?: 'TravelproductAddress';
  _id: Scalars['ID']['output'];
  address?: Maybe<Scalars['String']['output']>;
  addressDetail?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  lat?: Maybe<Scalars['Float']['output']>;
  lng?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  zipcode?: Maybe<Scalars['String']['output']>;
};

export type TravelproductAddressInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  addressDetail?: InputMaybe<Scalars['String']['input']>;
  lat?: InputMaybe<Scalars['Float']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
  zipcode?: InputMaybe<Scalars['String']['input']>;
};

export type TravelproductQuestion = {
  __typename?: 'TravelproductQuestion';
  _id: Scalars['ID']['output'];
  contents: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  travelproduct: Travelproduct;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type TravelproductQuestionAnswer = {
  __typename?: 'TravelproductQuestionAnswer';
  _id: Scalars['ID']['output'];
  contents: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  travelproductQuestion: TravelproductQuestion;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type UpdateBoardCommentInput = {
  contents?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateBoardInput = {
  boardAddress?: InputMaybe<BoardAddressInput>;
  contents?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  youtubeUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTravelproductInput = {
  contents?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  travelproductAddress?: InputMaybe<TravelproductAddressInput>;
};

export type UpdateTravelproductQuestionAnswerInput = {
  contents: Scalars['String']['input'];
};

export type UpdateTravelproductQuestionInput = {
  contents: Scalars['String']['input'];
};

export type UpdateUserInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  picture?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userPoint?: Maybe<UserPoint>;
};

export type UserPoint = {
  __typename?: 'UserPoint';
  _id: Scalars['ID']['output'];
  amount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type FetchUserLoggedInQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchUserLoggedInQuery = { __typename?: 'Query', fetchUserLoggedIn: { __typename?: 'User', _id: string, name: string } };

export type LoginUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginUserMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'Token', accessToken: string } };

export type CreateUserMutationVariables = Exact<{
  createUserInput: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', _id: string } };

export type FetchBoardsQueryVariables = Exact<{
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FetchBoardsQuery = { __typename?: 'Query', fetchBoards: Array<{ __typename?: 'Board', _id: string, writer?: string | null, title: string, contents: string, createdAt: any, likeCount: number, images?: Array<string> | null }> };

export type FetchBoardsCountQueryVariables = Exact<{
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type FetchBoardsCountQuery = { __typename?: 'Query', fetchBoardsCount: number };

export type FetchBoardsOfTheBestQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchBoardsOfTheBestQuery = { __typename?: 'Query', fetchBoardsOfTheBest: Array<{ __typename?: 'Board', _id: string, writer?: string | null, title: string, contents: string, youtubeUrl?: string | null, likeCount: number, dislikeCount: number, images?: Array<string> | null, createdAt: any, updatedAt: any, deletedAt?: any | null, boardAddress?: { __typename?: 'BoardAddress', _id: string, zipcode?: string | null, address?: string | null, addressDetail?: string | null } | null, user?: { __typename?: 'User', _id: string, email: string, name: string } | null }> };



export const FetchUserLoggedInDocument = `
    query FetchUserLoggedIn {
  fetchUserLoggedIn {
    _id
    name
  }
}
    `;

export const useFetchUserLoggedInQuery = <
      TData = FetchUserLoggedInQuery,
      TError = unknown
    >(
      variables?: FetchUserLoggedInQueryVariables,
      options?: Omit<UseQueryOptions<FetchUserLoggedInQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<FetchUserLoggedInQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<FetchUserLoggedInQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['FetchUserLoggedIn'] : ['FetchUserLoggedIn', variables],
    queryFn: fetcher<FetchUserLoggedInQuery, FetchUserLoggedInQueryVariables>(FetchUserLoggedInDocument, variables),
    ...options
  }
    )};

useFetchUserLoggedInQuery.getKey = (variables?: FetchUserLoggedInQueryVariables) => variables === undefined ? ['FetchUserLoggedIn'] : ['FetchUserLoggedIn', variables];

export const useSuspenseFetchUserLoggedInQuery = <
      TData = FetchUserLoggedInQuery,
      TError = unknown
    >(
      variables?: FetchUserLoggedInQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<FetchUserLoggedInQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<FetchUserLoggedInQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<FetchUserLoggedInQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['FetchUserLoggedInSuspense'] : ['FetchUserLoggedInSuspense', variables],
    queryFn: fetcher<FetchUserLoggedInQuery, FetchUserLoggedInQueryVariables>(FetchUserLoggedInDocument, variables),
    ...options
  }
    )};

useSuspenseFetchUserLoggedInQuery.getKey = (variables?: FetchUserLoggedInQueryVariables) => variables === undefined ? ['FetchUserLoggedInSuspense'] : ['FetchUserLoggedInSuspense', variables];


useFetchUserLoggedInQuery.fetcher = (variables?: FetchUserLoggedInQueryVariables) => fetcher<FetchUserLoggedInQuery, FetchUserLoggedInQueryVariables>(FetchUserLoggedInDocument, variables);

export const LoginUserDocument = `
    mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    accessToken
  }
}
    `;

export const useLoginUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LoginUserMutation, TError, LoginUserMutationVariables, TContext>) => {
    
    return useMutation<LoginUserMutation, TError, LoginUserMutationVariables, TContext>(
      {
    mutationKey: ['LoginUser'],
    mutationFn: (variables?: LoginUserMutationVariables) => fetcher<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, variables)(),
    ...options
  }
    )};


useLoginUserMutation.fetcher = (variables: LoginUserMutationVariables) => fetcher<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, variables);

export const CreateUserDocument = `
    mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    _id
  }
}
    `;

export const useCreateUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateUserMutation, TError, CreateUserMutationVariables, TContext>) => {
    
    return useMutation<CreateUserMutation, TError, CreateUserMutationVariables, TContext>(
      {
    mutationKey: ['CreateUser'],
    mutationFn: (variables?: CreateUserMutationVariables) => fetcher<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, variables)(),
    ...options
  }
    )};


useCreateUserMutation.fetcher = (variables: CreateUserMutationVariables) => fetcher<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, variables);

export const FetchBoardsDocument = `
    query fetchBoards($endDate: DateTime, $startDate: DateTime, $search: String, $page: Int) {
  fetchBoards(
    endDate: $endDate
    startDate: $startDate
    search: $search
    page: $page
  ) {
    _id
    writer
    title
    contents
    createdAt
    likeCount
    images
  }
}
    `;

export const useFetchBoardsQuery = <
      TData = FetchBoardsQuery,
      TError = unknown
    >(
      variables?: FetchBoardsQueryVariables,
      options?: Omit<UseQueryOptions<FetchBoardsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<FetchBoardsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<FetchBoardsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['fetchBoards'] : ['fetchBoards', variables],
    queryFn: fetcher<FetchBoardsQuery, FetchBoardsQueryVariables>(FetchBoardsDocument, variables),
    ...options
  }
    )};

useFetchBoardsQuery.getKey = (variables?: FetchBoardsQueryVariables) => variables === undefined ? ['fetchBoards'] : ['fetchBoards', variables];

export const useSuspenseFetchBoardsQuery = <
      TData = FetchBoardsQuery,
      TError = unknown
    >(
      variables?: FetchBoardsQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<FetchBoardsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<FetchBoardsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<FetchBoardsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['fetchBoardsSuspense'] : ['fetchBoardsSuspense', variables],
    queryFn: fetcher<FetchBoardsQuery, FetchBoardsQueryVariables>(FetchBoardsDocument, variables),
    ...options
  }
    )};

useSuspenseFetchBoardsQuery.getKey = (variables?: FetchBoardsQueryVariables) => variables === undefined ? ['fetchBoardsSuspense'] : ['fetchBoardsSuspense', variables];


useFetchBoardsQuery.fetcher = (variables?: FetchBoardsQueryVariables) => fetcher<FetchBoardsQuery, FetchBoardsQueryVariables>(FetchBoardsDocument, variables);

export const FetchBoardsCountDocument = `
    query fetchBoardsCount($endDate: DateTime, $startDate: DateTime, $search: String) {
  fetchBoardsCount(endDate: $endDate, startDate: $startDate, search: $search)
}
    `;

export const useFetchBoardsCountQuery = <
      TData = FetchBoardsCountQuery,
      TError = unknown
    >(
      variables?: FetchBoardsCountQueryVariables,
      options?: Omit<UseQueryOptions<FetchBoardsCountQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<FetchBoardsCountQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<FetchBoardsCountQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['fetchBoardsCount'] : ['fetchBoardsCount', variables],
    queryFn: fetcher<FetchBoardsCountQuery, FetchBoardsCountQueryVariables>(FetchBoardsCountDocument, variables),
    ...options
  }
    )};

useFetchBoardsCountQuery.getKey = (variables?: FetchBoardsCountQueryVariables) => variables === undefined ? ['fetchBoardsCount'] : ['fetchBoardsCount', variables];

export const useSuspenseFetchBoardsCountQuery = <
      TData = FetchBoardsCountQuery,
      TError = unknown
    >(
      variables?: FetchBoardsCountQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<FetchBoardsCountQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<FetchBoardsCountQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<FetchBoardsCountQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['fetchBoardsCountSuspense'] : ['fetchBoardsCountSuspense', variables],
    queryFn: fetcher<FetchBoardsCountQuery, FetchBoardsCountQueryVariables>(FetchBoardsCountDocument, variables),
    ...options
  }
    )};

useSuspenseFetchBoardsCountQuery.getKey = (variables?: FetchBoardsCountQueryVariables) => variables === undefined ? ['fetchBoardsCountSuspense'] : ['fetchBoardsCountSuspense', variables];


useFetchBoardsCountQuery.fetcher = (variables?: FetchBoardsCountQueryVariables) => fetcher<FetchBoardsCountQuery, FetchBoardsCountQueryVariables>(FetchBoardsCountDocument, variables);

export const FetchBoardsOfTheBestDocument = `
    query fetchBoardsOfTheBest {
  fetchBoardsOfTheBest {
    _id
    writer
    title
    contents
    youtubeUrl
    likeCount
    dislikeCount
    images
    boardAddress {
      _id
      zipcode
      address
      addressDetail
    }
    user {
      _id
      email
      name
    }
    createdAt
    updatedAt
    deletedAt
  }
}
    `;

export const useFetchBoardsOfTheBestQuery = <
      TData = FetchBoardsOfTheBestQuery,
      TError = unknown
    >(
      variables?: FetchBoardsOfTheBestQueryVariables,
      options?: Omit<UseQueryOptions<FetchBoardsOfTheBestQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<FetchBoardsOfTheBestQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<FetchBoardsOfTheBestQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['fetchBoardsOfTheBest'] : ['fetchBoardsOfTheBest', variables],
    queryFn: fetcher<FetchBoardsOfTheBestQuery, FetchBoardsOfTheBestQueryVariables>(FetchBoardsOfTheBestDocument, variables),
    ...options
  }
    )};

useFetchBoardsOfTheBestQuery.getKey = (variables?: FetchBoardsOfTheBestQueryVariables) => variables === undefined ? ['fetchBoardsOfTheBest'] : ['fetchBoardsOfTheBest', variables];

export const useSuspenseFetchBoardsOfTheBestQuery = <
      TData = FetchBoardsOfTheBestQuery,
      TError = unknown
    >(
      variables?: FetchBoardsOfTheBestQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<FetchBoardsOfTheBestQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<FetchBoardsOfTheBestQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<FetchBoardsOfTheBestQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['fetchBoardsOfTheBestSuspense'] : ['fetchBoardsOfTheBestSuspense', variables],
    queryFn: fetcher<FetchBoardsOfTheBestQuery, FetchBoardsOfTheBestQueryVariables>(FetchBoardsOfTheBestDocument, variables),
    ...options
  }
    )};

useSuspenseFetchBoardsOfTheBestQuery.getKey = (variables?: FetchBoardsOfTheBestQueryVariables) => variables === undefined ? ['fetchBoardsOfTheBestSuspense'] : ['fetchBoardsOfTheBestSuspense', variables];


useFetchBoardsOfTheBestQuery.fetcher = (variables?: FetchBoardsOfTheBestQueryVariables) => fetcher<FetchBoardsOfTheBestQuery, FetchBoardsOfTheBestQueryVariables>(FetchBoardsOfTheBestDocument, variables);
