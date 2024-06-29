import { retrieveLaunchParams } from '@tma.js/sdk';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createAxiosWithAuth } from '../functions';

interface PointsContextProps {
  points: number;
  refreshPoints: () => void;
}

const PointsContext = createContext<PointsContextProps | undefined>(undefined);

interface PointsProviderProps {
  children: ReactNode;
}

export const PointsProvider: React.FC<PointsProviderProps> = ({ children }) => {
  const [points, setPoints] = useState<number>(0);

  const { initDataRaw } = retrieveLaunchParams();

  const fetchPoints = useCallback(async () => {
    if (!initDataRaw) return;
    try {
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<number>(`/points`);
      setPoints(response.data);
    } catch (error) {
      return 0;
    }
  }, [initDataRaw]);

  useEffect(() => {
    fetchPoints();
    // eslint-disable-next-line
  }, []);

  return (
    <PointsContext.Provider value={{ points, refreshPoints: fetchPoints }}>
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
