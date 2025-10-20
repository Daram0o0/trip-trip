'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 데이터가 오래된 것으로 간주되는 시간 (5분)
            staleTime: 1000 * 60 * 5,
            // 캐시에서 데이터를 유지하는 시간 (10분)
            gcTime: 1000 * 60 * 10,
            // 백그라운드에서 자동으로 데이터를 다시 가져오는지 여부
            refetchOnWindowFocus: false,
            // 네트워크가 다시 연결될 때 자동으로 데이터를 다시 가져오는지 여부
            refetchOnReconnect: true,
            // 컴포넌트가 마운트될 때 자동으로 데이터를 다시 가져오는지 여부
            refetchOnMount: true,
            // 재시도 횟수
            retry: 3,
            // 재시도 간격 (지수 백오프)
            retryDelay: attemptIndex =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // 뮤테이션 재시도 횟수
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
