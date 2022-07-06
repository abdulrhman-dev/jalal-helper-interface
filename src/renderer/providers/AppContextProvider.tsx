import DuplicateProvider from './DuplicateProvider';
import PhoneProvider from './PhoneProvider';

const combineComponents = (...components) => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) => {
      return ({ children }) => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>
  );
};

// Providers
const providers = [DuplicateProvider, PhoneProvider];

export default combineComponents(...providers);
