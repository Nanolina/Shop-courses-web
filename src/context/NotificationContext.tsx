import React, { ReactNode, createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

interface NotificationContextType {
  showNotification: (
    message: string,
    status: 'success' | 'error' | 'info'
  ) => void;
  disableNotification: boolean;
  setDisableNotification: (disable: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [disableNotification, setDisableNotification] = useState(false);

  const showNotification = (
    message: string,
    status: 'success' | 'error' | 'info'
  ) => {
    if (!disableNotification) {
      if (status === 'success') {
        toast.success(message);
      } else if (status === 'error') {
        toast.error(message);
      } else {
        toast.info(message);
      }
    }
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, disableNotification, setDisableNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
