'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Board, BoardComment } from '@/commons/graphql/react-query-hooks';
import {
  useLikeBoardMutation,
  useDislikeBoardMutation,
} from '@/commons/graphql/react-query-hooks';

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
  isLiked: boolean;
  isDisliked: boolean;
  handleLikeClick: () => void;
  handleDislikeClick: () => void;
}

export function useBoardDetailBinding(
  params: UseBoardDetailBindingParams
): UseBoardDetailBindingResult {
  const boardId = params.boardId ?? '';
  const queryClient = useQueryClient();

  const { data: boardData } = useQuery({
    queryKey: ['fetchBoard', boardId],
    enabled: Boolean(boardId),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const res = await fetch(
        'https://main-practice.codebootcamp.co.kr/graphql',
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

  // 좋아요/싫어요 상태 관리 (localStorage 기반)
  const getLikeStatusFromStorage = useCallback(() => {
    if (typeof window === 'undefined' || !boardId)
      return { isLiked: false, isDisliked: false };
    try {
      const liked = localStorage.getItem(`board-like-${boardId}`) === 'true';
      const disliked =
        localStorage.getItem(`board-dislike-${boardId}`) === 'true';
      return { isLiked: liked, isDisliked: disliked };
    } catch {
      return { isLiked: false, isDisliked: false };
    }
  }, [boardId]);

  const [likeStatus, setLikeStatusState] = useState<{
    isLiked: boolean;
    isDisliked: boolean;
  }>(() => getLikeStatusFromStorage());

  // boardId가 변경되면 localStorage에서 상태 읽기
  useEffect(() => {
    setLikeStatusState(getLikeStatusFromStorage());
  }, [boardId, getLikeStatusFromStorage]);

  const setLikeStatus = useCallback(
    (isLiked: boolean, isDisliked: boolean) => {
      if (typeof window === 'undefined' || !boardId) return;
      try {
        // 좋아요/싫어요를 서로 독립적으로 저장 (둘 다 true 가능)
        if (isLiked) {
          localStorage.setItem(`board-like-${boardId}`, 'true');
        } else {
          localStorage.removeItem(`board-like-${boardId}`);
        }
        if (isDisliked) {
          localStorage.setItem(`board-dislike-${boardId}`, 'true');
        } else {
          localStorage.removeItem(`board-dislike-${boardId}`);
        }
        setLikeStatusState({ isLiked, isDisliked });
      } catch {
        // localStorage 오류 무시
      }
    },
    [boardId]
  );

  const isLiked = likeStatus.isLiked;
  const isDisliked = likeStatus.isDisliked;

  // 좋아요 mutation
  const likeMutation = useLikeBoardMutation({
    onSuccess: async () => {
      // 성공 시 쿼리 캐시 업데이트
      await queryClient.invalidateQueries({
        queryKey: ['fetchBoard', boardId],
      });
      // Boards 관련 리스트/베스트/카운트 최신화
      await queryClient.invalidateQueries({
        predicate: q => {
          const k = q.queryKey?.[0];
          return (
            k === 'fetchBoards' ||
            k === 'fetchBoardsSuspense' ||
            k === 'fetchBoardsCount' ||
            k === 'fetchBoardsOfTheBest'
          );
        },
      });
      // 기존 싫어요 상태는 유지하면서 좋아요만 true로 설정
      setLikeStatus(true, likeStatus.isDisliked);
    },
    onError: error => {
      console.error('좋아요 실패:', error);
    },
  });

  // 싫어요 mutation
  const dislikeMutation = useDislikeBoardMutation({
    onSuccess: async () => {
      // 성공 시 쿼리 캐시 업데이트
      await queryClient.invalidateQueries({
        queryKey: ['fetchBoard', boardId],
      });
      // Boards 관련 리스트/베스트/카운트 최신화
      await queryClient.invalidateQueries({
        predicate: q => {
          const k = q.queryKey?.[0];
          return (
            k === 'fetchBoards' ||
            k === 'fetchBoardsSuspense' ||
            k === 'fetchBoardsCount' ||
            k === 'fetchBoardsOfTheBest'
          );
        },
      });
      // 기존 좋아요 상태는 유지하면서 싫어요만 true로 설정
      setLikeStatus(likeStatus.isLiked, true);
    },
    onError: error => {
      console.error('싫어요 실패:', error);
    },
  });

  const handleLikeClick = useCallback(() => {
    if (!boardId) return;
    // 이미 좋아요를 눌렀다면 무시 (취소 기능 제거)
    if (isLiked) return;
    likeMutation.mutate({ boardId });
  }, [boardId, isLiked, likeMutation]);

  const handleDislikeClick = useCallback(() => {
    if (!boardId) return;
    // 이미 싫어요를 눌렀다면 무시 (한 아이디당 하나의 싫어요만)
    if (isDisliked) return;
    dislikeMutation.mutate({ boardId });
  }, [boardId, isDisliked, dislikeMutation]);

  const { data: commentsData } = useQuery({
    queryKey: ['fetchBoardComments', boardId, 1],
    enabled: Boolean(boardId),
    staleTime: 10_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const res = await fetch(
        'https://main-practice.codebootcamp.co.kr/graphql',
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
        // https://www.youtube.com/shorts/VIDEO_ID 형식 (유튜브 쇼츠)
        const shortsMatch = url.match(/\/shorts\/([^?]+)/);
        if (shortsMatch) {
          return shortsMatch[1];
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

  return {
    detail,
    comments,
    isLiked,
    isDisliked,
    handleLikeClick,
    handleDislikeClick,
  };
}
