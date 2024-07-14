import { useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
} from 'react';
import { fetchPointsAPI } from '../requests';

interface PointsContextProps {
  points: number;
  refreshPoints: () => void;
}

interface PointsProviderProps {
  children: ReactNode;
}

const PointsContext = createContext<PointsContextProps | undefined>(undefined);

export const PointsProvider: React.FC<PointsProviderProps> = ({ children }) => {
  const { initDataRaw } = retrieveLaunchParams();
  const queryClient = useQueryClient();

  const refreshPoints = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['points', initDataRaw],
    });
  }, [queryClient, initDataRaw]);

  const { data } = useQuery<number>({
    queryKey: ['points', initDataRaw],
    queryFn: () => fetchPointsAPI(initDataRaw),
    placeholderData: () => {
      return queryClient.getQueryData(['points', initDataRaw]);
    },
  });

  return (
    <PointsContext.Provider value={{ points: data ?? 0, refreshPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = (): PointsContextProps => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};
