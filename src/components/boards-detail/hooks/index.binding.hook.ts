'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Board, BoardComment } from '@/commons/graphql/react-query-hooks';

export interface BoardDetailBinding {
  id: string;
  title: string;
  writer: string;
  contents: string;
  createdDate: string;
  likeCount: number;
  dislikeCount: number;
  image: string;
  youtubeUrl?: string | null;
  addressText?: string | null;
}

export interface BoardCommentBinding {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

interface UseBoardDetailBindingParams {
  boardId: string | undefined;
}

interface UseBoardDetailBindingResult {
  detail?: BoardDetailBinding;
  comments: BoardCommentBinding[];
}

export function useBoardDetailBinding(
  params: UseBoardDetailBindingParams
): UseBoardDetailBindingResult {
  const boardId = params.boardId ?? '';

  const { data: boardData } = useQuery({
    queryKey: ['fetchBoard', boardId],
    enabled: Boolean(boardId),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const res = await fetch(
        'http://main-practice.codebootcamp.co.kr/graphql',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query($boardId:ID!){ fetchBoard(boardId:$boardId){ _id writer title contents youtubeUrl likeCount dislikeCount images boardAddress{ address addressDetail } createdAt } }`,
            variables: { boardId },
          }),
        }
      );
      const json = await res.json();
      if (json.errors)
        throw new Error(json.errors[0]?.message ?? 'GraphQL Error');
      return json.data as { fetchBoard?: Board };
    },
  });

  const { data: commentsData } = useQuery({
    queryKey: ['fetchBoardComments', boardId, 1],
    enabled: Boolean(boardId),
    staleTime: 10_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const res = await fetch(
        'http://main-practice.codebootcamp.co.kr/graphql',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query($boardId:ID!,$page:Int){ fetchBoardComments(boardId:$boardId,page:$page){ _id writer contents rating createdAt } }`,
            variables: { boardId, page: 1 },
          }),
        }
      );
      const json = await res.json();
      if (json.errors)
        throw new Error(json.errors[0]?.message ?? 'GraphQL Error');
      return json.data as { fetchBoardComments?: BoardComment[] };
    },
  });

  const detail: BoardDetailBinding | undefined = useMemo(() => {
    const board = boardData?.fetchBoard;
    if (!board) return undefined;
    const addressText = board.boardAddress
      ? [board.boardAddress.address, board.boardAddress.addressDetail]
          .filter(Boolean)
          .join(' ')
      : null;
    return {
      id: board._id,
      title: board.title,
      writer: board.writer ?? '익명',
      contents: board.contents,
      createdDate: new Date(board.createdAt)
        .toISOString()
        .split('T')[0]
        .replaceAll('-', '.'),
      likeCount: board.likeCount ?? 0,
      dislikeCount: board.dislikeCount ?? 0,
      image: board.images?.[0] ?? '/images/img.png',
      youtubeUrl: board.youtubeUrl ?? null,
      addressText,
    };
  }, [boardData]);

  const comments: BoardCommentBinding[] = useMemo(() => {
    const list = (commentsData?.fetchBoardComments ?? []) as Array<{
      _id: string;
      writer?: string | null;
      contents: string;
      rating?: number | null;
      createdAt: string;
    }>;
    return list.map(commentItem => ({
      id: commentItem._id,
      author: commentItem.writer ?? '익명',
      rating: Number(commentItem.rating ?? 0),
      content: commentItem.contents,
      date: new Date(commentItem.createdAt)
        .toISOString()
        .split('T')[0]
        .replaceAll('-', '.'),
    }));
  }, [commentsData]);

  return { detail, comments };
}
