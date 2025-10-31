'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export interface SearchParams {
  search: string;
  startDate: string | null;
  endDate: string | null;
}

interface UseBoardsSearchResult {
  searchValue: string;
  startDate: string | null;
  endDate: string | null;
  setSearchValue: (value: string) => void;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  handleSearch: () => void;
  handleDateRangeChange: (start: string | null, end: string | null) => void;
  handleReset: () => void;
}

export function useBoardsSearch(): UseBoardsSearchResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터에서 검색 조건 읽기
  const [searchValue, setSearchValueState] = useState<string>(
    searchParams.get('search') || ''
  );
  const [startDate, setStartDateState] = useState<string | null>(
    searchParams.get('startDate') || null
  );
  const [endDate, setEndDateState] = useState<string | null>(
    searchParams.get('endDate') || null
  );

  // URL 쿼리 파라미터 변경 시 상태 업데이트
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const start = searchParams.get('startDate') || null;
    const end = searchParams.get('endDate') || null;

    setSearchValueState(search);
    setStartDateState(start);
    setEndDateState(end);
  }, [searchParams]);

  // URL 쿼리 파라미터 업데이트
  const updateURL = useCallback(
    (updates: {
      search?: string;
      startDate?: string | null;
      endDate?: string | null;
      page?: number | null;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      // 검색어 업데이트
      if (updates.search !== undefined) {
        if (updates.search.trim() === '') {
          params.delete('search');
        } else {
          params.set('search', updates.search);
        }
      }

      // 시작일 업데이트
      if (updates.startDate !== undefined) {
        if (updates.startDate === null || updates.startDate === '') {
          params.delete('startDate');
        } else {
          params.set('startDate', updates.startDate);
        }
      }

      // 종료일 업데이트
      if (updates.endDate !== undefined) {
        if (updates.endDate === null || updates.endDate === '') {
          params.delete('endDate');
        } else {
          params.set('endDate', updates.endDate);
        }
      }

      // 페이지 업데이트 (검색 시 첫 페이지로 이동)
      if (updates.page !== undefined) {
        if (updates.page === null || updates.page === 1) {
          params.delete('page');
        } else {
          params.set('page', String(updates.page));
        }
      }

      const newSearch = params.toString();
      const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;
      router.replace(newUrl);
    },
    [searchParams, pathname, router]
  );

  const setSearchValue = useCallback((value: string) => {
    setSearchValueState(value);
  }, []);

  const setStartDate = useCallback((date: string | null) => {
    setStartDateState(date);
  }, []);

  const setEndDate = useCallback((date: string | null) => {
    setEndDateState(date);
  }, []);

  const handleDateRangeChange = useCallback(
    (start: string | null, end: string | null) => {
      setStartDateState(start);
      setEndDateState(end);
    },
    []
  );

  const handleSearch = useCallback(() => {
    // 검색 실행 시 첫 페이지로 이동
    updateURL({
      search: searchValue.trim() === '' ? '' : searchValue.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      page: 1,
    });
  }, [searchValue, startDate, endDate, updateURL]);

  const handleReset = useCallback(() => {
    // 모든 검색 조건 초기화
    setSearchValueState('');
    setStartDateState(null);
    setEndDateState(null);
    // URL도 초기화 (첫 페이지로 이동)
    updateURL({
      search: '',
      startDate: null,
      endDate: null,
      page: 1,
    });
  }, [updateURL]);

  return {
    searchValue,
    startDate,
    endDate,
    setSearchValue,
    setStartDate,
    setEndDate,
    handleSearch,
    handleDateRangeChange,
    handleReset,
  };
}
