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
  images?: string[] | null;
  youtubeUrl?: string | null;
  youtubeThumbnail?: string | null;
  youtubeEmbedUrl?: string | null;
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

    // 유튜브 Video ID 추출
    const getYoutubeVideoId = (
      url: string | null | undefined
    ): string | null => {
      if (!url) return null;
      try {
        // https://www.youtube.com/watch?v=VIDEO_ID 형식
        const watchMatch = url.match(/[?&]v=([^&]+)/);
        if (watchMatch) {
          return watchMatch[1];
        }
        // https://youtu.be/VIDEO_ID 형식
        const shortMatch = url.match(/youtu\.be\/([^?]+)/);
        if (shortMatch) {
          return shortMatch[1];
        }
        // https://www.youtube.com/embed/VIDEO_ID 형식
        const embedMatch = url.match(/\/embed\/([^?]+)/);
        if (embedMatch) {
          return embedMatch[1];
        }
      } catch {
        // URL 파싱 실패 시 null 반환
      }
      return null;
    };

    const videoId = getYoutubeVideoId(board.youtubeUrl);
    const youtubeThumbnail = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null;
    const youtubeEmbedUrl = videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
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
      images: board.images ?? null,
      youtubeUrl: board.youtubeUrl ?? null,
      youtubeThumbnail,
      youtubeEmbedUrl,
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
