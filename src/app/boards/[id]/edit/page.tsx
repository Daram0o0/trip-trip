'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import BoardsNew from '@/components/boards-new';

interface Board {
  _id: string;
  writer?: string | null;
  title: string;
  contents: string;
  youtubeUrl?: string | null;
  images?: string[] | null;
  boardAddress?: {
    zipcode?: string | null;
    address?: string | null;
    addressDetail?: string | null;
  } | null;
}

const BoardsEditPage = () => {
  const params = useParams();
  const boardId = params?.id as string;

  // 게시물 데이터 조회 (항상 최신 데이터 가져오기)
  const { data, isLoading, error } = useQuery<{ fetchBoard?: Board }>({
    queryKey: ['fetchBoard', boardId],
    enabled: Boolean(boardId),
    staleTime: 0, // 캐시 사용 안 함, 항상 최신 데이터 가져오기
    gcTime: 5 * 60_000,
    refetchOnMount: 'always', // 컴포넌트 마운트 시 항상 리패치
    queryFn: async () => {
      const res = await fetch(
        'http://main-practice.codebootcamp.co.kr/graphql',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query($boardId: ID!) {
                fetchBoard(boardId: $boardId) {
                  _id
                  writer
                  title
                  contents
                  youtubeUrl
                  images
                  boardAddress {
                    zipcode
                    address
                    addressDetail
                  }
                  createdAt
                }
              }
            `,
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

  // 로딩 중 상태
  if (isLoading) {
    return (
      <div data-testid="boards-new-container">
        <div>로딩 중...</div>
      </div>
    );
  }

  // 에러 처리
  if (error || !data?.fetchBoard) {
    return (
      <div data-testid="boards-new-container">
        <div>게시물을 불러오는 중 오류가 발생했습니다.</div>
      </div>
    );
  }

  const board = data.fetchBoard;

  // initialData 구성 (zipcode가 null이어도 빈 문자열로 처리)
  const initialData = {
    author: board.writer || '',
    password: '', // 비밀번호는 서버에서 받아오지 않음
    title: board.title || '',
    content: board.contents || '',
    postcode: board.boardAddress?.zipcode ?? '', // null이면 빈 문자열
    address: board.boardAddress?.address ?? '', // null이면 빈 문자열
    detailAddress: board.boardAddress?.addressDetail ?? '', // null이면 빈 문자열
    youtubeLink: board.youtubeUrl || '',
    images: board.images || [],
  };

  // initialData의 주요 필드를 기반으로 key 생성하여 데이터 변경 시 컴포넌트 재마운트
  // 이렇게 하면 usePostcodeBinding의 useState가 최신 initialData로 초기화됨
  const componentKey = `${boardId}-${initialData.postcode}-${initialData.address}-${initialData.title}`;

  return (
    <BoardsNew
      key={componentKey}
      mode="edit"
      initialData={initialData}
      boardId={boardId}
    />
  );
};

export default BoardsEditPage;
