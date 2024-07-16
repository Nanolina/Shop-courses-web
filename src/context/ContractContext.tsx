import React, { ReactNode, createContext, useContext, useState } from 'react';

interface ContractContextProps {
  courseContractBalance: number;
  setCourseContractBalance: React.Dispatch<React.SetStateAction<number>>;
  purchaseContractBalance: number;
  setPurchaseContractBalance: React.Dispatch<React.SetStateAction<number>>;
  hasAcceptedTermsCourse: boolean;
  setHasAcceptedTermsCourse: React.Dispatch<React.SetStateAction<boolean>>;
  hasAcceptedTermsPurchase: boolean;
  setHasAcceptedTermsPurchase: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContractContext = createContext<ContractContextProps | undefined>(
  undefined
);

interface ContractProviderProps {
  children: ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps> = ({
  children,
}: any) => {
  const [courseContractBalance, setCourseContractBalance] = useState<number>(0);
  const [purchaseContractBalance, setPurchaseContractBalance] =
    useState<number>(0);
  const [hasAcceptedTermsCourse, setHasAcceptedTermsCourse] =
    useState<boolean>(false);
  const [hasAcceptedTermsPurchase, setHasAcceptedTermsPurchase] =
    useState<boolean>(false);

  return (
    <ContractContext.Provider
      value={{
        courseContractBalance,
        setCourseContractBalance,
        purchaseContractBalance,
        setPurchaseContractBalance,
        hasAcceptedTermsCourse,
        setHasAcceptedTermsCourse,
        hasAcceptedTermsPurchase,
        setHasAcceptedTermsPurchase,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = (): ContractContextProps => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};
