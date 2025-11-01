'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDeleteBoardMutation } from '@/commons/graphql/react-query-hooks';

interface UseBoardsDeleteParams {
  pageSize?: number;
}

interface UseBoardsDeleteResult {
  deleteBoardById: (boardId: string) => Promise<boolean>;
}

export function useBoardsDelete(
  params: UseBoardsDeleteParams = {}
): UseBoardsDeleteResult {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSize = params.pageSize ?? 10;

  const deleteMutation = useDeleteBoardMutation({
    onSuccess: async () => {
      // 삭제 성공 시 관련 쿼리 무효화
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['fetchBoards'] }),
        queryClient.invalidateQueries({ queryKey: ['fetchBoardsCount'] }),
        queryClient.invalidateQueries({ queryKey: ['fetchBoardsOfTheBest'] }),
      ]);
    },
    onError: error => {
      console.error('게시물 삭제 실패:', error);
      throw error;
    },
  });

  const deleteBoardById = useCallback(
    async (boardId: string): Promise<boolean> => {
      const result = await deleteMutation.mutateAsync({ boardId });
      // API 응답이 string이므로 Boolean으로 변환
      // GraphQL 타입이 string으로 정의되어 있지만, 실제로는 'true' 또는 'false' 문자열 반환
      const success = result.deleteBoard === 'true';

      // 삭제 성공 시 관련 쿼리는 onSuccess에서 처리되지만,
      // 페이지 조정을 위해 여기서 추가 처리
      if (success) {
        // 현재 페이지 정보 확인
        const pageParam = searchParams.get('page');
        const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

        // count 쿼리를 refetch하여 최신 개수 확인
        await queryClient.refetchQueries({ queryKey: ['fetchBoardsCount'] });

        // 모든 fetchBoardsCount 쿼리 중 첫 번째 결과 사용
        // (검색 조건이 다른 경우 여러 쿼리가 있을 수 있음)
        const queries = queryClient.getQueriesData({
          queryKey: ['fetchBoardsCount'],
        });
        const countData = queries[0]?.[1] as
          | { fetchBoardsCount?: number }
          | undefined;
        const totalCount = countData?.fetchBoardsCount ?? 0;
        const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

        // 현재 페이지가 유효한지 확인하고, 필요시 이전 페이지로 이동
        if (currentPage > totalPages && totalPages > 0) {
          const params = new URLSearchParams(searchParams.toString());
          if (totalPages === 1) {
            params.delete('page');
          } else {
            params.set('page', String(totalPages));
          }
          const newSearch = params.toString();
          const newUrl = newSearch ? `/boards?${newSearch}` : '/boards';
          router.replace(newUrl);
        }
      }

      return success;
    },
    [deleteMutation, queryClient, router, searchParams, pageSize]
  );

  return {
    deleteBoardById,
  };
}
