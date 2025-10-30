'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  useFetchBoardsCountQuery,
  useFetchBoardsOfTheBestQuery,
  useFetchBoardsQuery,
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
}

export function useBoardsBinding(
  params: UseBoardsBindingParams = {}
): UseBoardsBindingResult {
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

  return { galleryCards, boardItems, currentPage, totalPages, setPage };
}
