import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

interface ModalContextProps {
  isOpen: boolean;
  showModal: (type: string, name: string) => void;
  hideModal: () => void;
  deployType: string | null;
  courseName: string;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deployType, setDeployType] = useState<string | null>(null);
  const [courseName, setCourseName] = useState<string>('');

  const showModal = useCallback((type: string, name: string) => {
    setDeployType(type);
    setCourseName(name);
    setIsOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{ isOpen, showModal, hideModal, deployType, courseName }}
    >
      {children}
    </ModalContext.Provider>
  );
};
