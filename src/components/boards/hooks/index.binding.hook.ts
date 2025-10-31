'use client';

import { useMemo, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useFetchBoardsCountQuery,
  useFetchBoardsOfTheBestQuery,
  useFetchBoardsQuery,
  useLikeBoardMutation,
} from '@/commons/graphql/react-query-hooks';

export interface GalleryCardBinding {
  id: string;
  title: string;
  author: string;
  authorImage: string;
  likeCount: number;
  date: string;
  image: string;
}

export interface BoardItemBinding {
  id: string;
  number: number;
  title: string;
  author: string;
  date: string;
}

interface UseBoardsBindingParams {
  initialPage?: number;
  pageSize?: number;
}

interface UseBoardsBindingResult {
  galleryCards: GalleryCardBinding[];
  boardItems: BoardItemBinding[];
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  likeBoardById: (boardId: string) => Promise<number>;
}

export function useBoardsBinding(
  params: UseBoardsBindingParams = {}
): UseBoardsBindingResult {
  const queryClient = useQueryClient();
  const pageSize = params.pageSize ?? 10;
  const [currentPage, setCurrentPage] = useState<number>(
    params.initialPage ?? 1
  );

  // 입력값: 현재 요구사항에서는 검색/기간 필수 아님. 확장 대비 파라미터만 유지
  const variablesBoards = useMemo(() => ({ page: currentPage }), [currentPage]);

  const variablesCount = useMemo(() => ({}), []);

  const { data: listData } = useFetchBoardsQuery(variablesBoards, {
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const { data: countData } = useFetchBoardsCountQuery(variablesCount, {
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const { data: bestData } = useFetchBoardsOfTheBestQuery(undefined, {
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const likeMutation = useLikeBoardMutation();

  const totalCount = countData?.fetchBoardsCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const galleryCards: GalleryCardBinding[] = useMemo(() => {
    const items = bestData?.fetchBoardsOfTheBest ?? [];
    return items.map(item => {
      const image = item.images?.[0] ?? '/images/img.png';
      return {
        id: item._id,
        title: item.title,
        author: item.writer ?? '익명',
        authorImage: '/images/profile/img.png',
        likeCount: item.likeCount ?? 0,
        date: new Date(item.createdAt).toISOString().split('T')[0],
        image,
      };
    });
  }, [bestData]);

  const boardItems: BoardItemBinding[] = useMemo(() => {
    const items = listData?.fetchBoards ?? [];
    const startNumber = totalCount - (currentPage - 1) * pageSize;
    return items.map((item, idx) => ({
      id: item._id,
      number: Math.max(1, startNumber - idx),
      title: item.title,
      author: item.writer ?? '익명',
      date: new Date(item.createdAt)
        .toISOString()
        .split('T')[0]
        .replaceAll('-', '.'),
    }));
  }, [listData, totalCount, currentPage, pageSize]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const likeBoardById = useCallback(
    async (boardId: string): Promise<number> => {
      const result = await likeMutation.mutateAsync({ boardId });
      // 로컬 상태 지속화: 재방문 시 하트 유지
      try {
        localStorage.setItem(`board-like-${boardId}`, 'true');
      } catch {}
      // 관련 리스트 최신화
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['fetchBoards'] }),
        queryClient.invalidateQueries({ queryKey: ['fetchBoardsOfTheBest'] }),
        queryClient.invalidateQueries({ queryKey: ['fetchBoardsCount'] }),
      ]);
      return result.likeBoard;
    },
    [likeMutation, queryClient]
  );

  return {
    galleryCards,
    boardItems,
    currentPage,
    totalPages,
    setPage,
    likeBoardById,
  };
}
