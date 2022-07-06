import { createContext, useContext, useState } from 'react';

const intialState = {
  phoneResult: [],
};

const PhoneContext = createContext<PhoneState>(intialState);
const SetPhoneContext = createContext(null);

export const usePhone = (): PhoneState => useContext(PhoneContext);
export const useSetPhone = (): CallableFunction => useContext(SetPhoneContext);

export default function DuplicateProvider({ children }) {
  const [state, setState] = useState<PhoneState>(intialState);

  const changeState = (value: PhoneState) => {
    setState(value);
  };

  return (
    <PhoneContext.Provider value={state}>
      <SetPhoneContext.Provider value={changeState}>
        {children}
      </SetPhoneContext.Provider>
    </PhoneContext.Provider>
  );
}
