'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSize = params.pageSize ?? 10;

  // URL 쿼리 파라미터에서 검색 조건 및 페이지 읽기
  const search = searchParams.get('search') || '';
  const startDate = searchParams.get('startDate') || null;
  const endDate = searchParams.get('endDate') || null;
  const pageParam = searchParams.get('page');
  const initialPage = pageParam
    ? parseInt(pageParam, 10)
    : (params.initialPage ?? 1);

  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // URL 쿼리 파라미터 변경 시 페이지 업데이트
  useEffect(() => {
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    if (page !== currentPage && !isNaN(page) && page > 0) {
      setCurrentPage(page);
    }
  }, [pageParam, currentPage]);

  // DateTime 형식 변환 (yyyy-mm-dd -> ISO DateTime)
  const formatDateTime = useCallback(
    (dateStr: string | null): string | null => {
      if (!dateStr) return null;
      // 날짜 문자열을 DateTime 형식으로 변환 (yyyy-mm-dd -> yyyy-mm-ddTHH:mm:ss.sssZ)
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        return date.toISOString();
      } catch {
        return null;
      }
    },
    []
  );

  // startDate와 endDate가 같을 때 endDate를 하루 뒤로 조정
  const adjustEndDateIfSame = useCallback(
    (start: string | null, end: string | null): string | null => {
      if (!start || !end) return end;
      // 날짜만 비교 (시간 제외)
      const startDateOnly = start.split('T')[0];
      const endDateOnly = end.split('T')[0];

      if (startDateOnly === endDateOnly) {
        // 같은 날짜이면 하루 뒤로 조정
        const date = new Date(end);
        date.setDate(date.getDate() + 1);
        return date.toISOString();
      }
      return end;
    },
    []
  );

  // API 변수 생성
  const variablesBoards = useMemo(() => {
    const vars: {
      page: number;
      search?: string;
      startDate?: string;
      endDate?: string;
    } = { page: currentPage };

    if (search.trim()) {
      vars.search = search.trim();
    }

    const formattedStartDate = formatDateTime(startDate);
    if (formattedStartDate) {
      vars.startDate = formattedStartDate;
    }

    const formattedEndDate = formatDateTime(endDate);
    if (formattedEndDate) {
      // startDate와 endDate가 같을 때 endDate를 하루 뒤로 조정
      const adjustedEndDate = adjustEndDateIfSame(
        formattedStartDate,
        formattedEndDate
      );
      vars.endDate = adjustedEndDate || formattedEndDate;
    }

    return vars;
  }, [
    currentPage,
    search,
    startDate,
    endDate,
    formatDateTime,
    adjustEndDateIfSame,
  ]);

  const variablesCount = useMemo(() => {
    const vars: {
      search?: string;
      startDate?: string;
      endDate?: string;
    } = {};

    if (search.trim()) {
      vars.search = search.trim();
    }

    const formattedStartDate = formatDateTime(startDate);
    if (formattedStartDate) {
      vars.startDate = formattedStartDate;
    }

    const formattedEndDate = formatDateTime(endDate);
    if (formattedEndDate) {
      // startDate와 endDate가 같을 때 endDate를 하루 뒤로 조정
      const adjustedEndDate = adjustEndDateIfSame(
        formattedStartDate,
        formattedEndDate
      );
      vars.endDate = adjustedEndDate || formattedEndDate;
    }

    return vars;
  }, [search, startDate, endDate, formatDateTime, adjustEndDateIfSame]);

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

  // startDate와 endDate가 같을 때 응답 데이터 필터링
  const filterItemsBySameDate = useCallback(
    (items: NonNullable<typeof listData>['fetchBoards']) => {
      if (!items || !startDate || !endDate) return items;

      const startDateOnly = startDate.split('T')[0];
      const endDateOnly = endDate.split('T')[0];

      // startDate와 endDate가 같을 때만 필터링
      if (startDateOnly === endDateOnly) {
        return items.filter(item => {
          const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
          return itemDate === startDateOnly;
        });
      }

      return items;
    },
    [startDate, endDate]
  );

  const boardItems: BoardItemBinding[] = useMemo(() => {
    const items = listData?.fetchBoards ?? [];
    // startDate와 endDate가 같을 때 필터링
    const filteredItems = filterItemsBySameDate(items);
    const startNumber = totalCount - (currentPage - 1) * pageSize;
    return filteredItems.map((item, idx) => ({
      id: item._id,
      number: Math.max(1, startNumber - idx),
      title: item.title,
      author: item.writer ?? '익명',
      date: new Date(item.createdAt)
        .toISOString()
        .split('T')[0]
        .replaceAll('-', '.'),
    }));
  }, [listData, totalCount, currentPage, pageSize, filterItemsBySameDate]);

  const setPage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      // URL 쿼리 파라미터 업데이트
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', String(page));
      }
      const newSearch = params.toString();
      const newUrl = newSearch ? `/boards?${newSearch}` : '/boards';
      router.replace(newUrl);
    },
    [searchParams, router]
  );

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
