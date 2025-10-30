'use client';

import { useRouter } from 'next/navigation';
import { URLS } from '@/commons/constants/url';

interface UseBoardsLinkRouting {
  handleClickHotCard: (id: string | number) => void;
  handleClickBoardItem: (id: string | number) => void;
  handleClickCreate: () => void;
}

export function useBoardsLinkRouting(): UseBoardsLinkRouting {
  const router = useRouter();

  const navigateToDetail = (id: string | number): void => {
    const href = URLS.build.boardDetail(id);
    router.push(href);
  };

  const handleClickHotCard = (id: string | number): void => {
    navigateToDetail(id);
  };

  const handleClickBoardItem = (id: string | number): void => {
    navigateToDetail(id);
  };

  const handleClickCreate = (): void => {
    router.push(URLS.boards.create);
  };

  return { handleClickHotCard, handleClickBoardItem, handleClickCreate };
}
