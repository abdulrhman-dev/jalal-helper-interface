import React, { createContext, useContext, useState } from 'react';

const intialState = {
  duplicate: [],
  currentIndex: 0,
  total: 0,
};

const DuplicateContext = createContext<DuplicateState>(intialState);
const SetDuplicateContext = createContext(null);

export const useDuplicate = (): DuplicateState => useContext(DuplicateContext);
export const useSetDuplicate = (): CallableFunction =>
  useContext(SetDuplicateContext);

export default function DuplicateProvider({ children }) {
  const [duplicateState, setDuplicateState] =
    useState<DuplicateState>(intialState);

  const changeDuplicateState = (value: DuplicateState) => {
    setDuplicateState(value);
  };

  return (
    <DuplicateContext.Provider value={duplicateState}>
      <SetDuplicateContext.Provider value={changeDuplicateState}>
        {children}
      </SetDuplicateContext.Provider>
    </DuplicateContext.Provider>
  );
}
