declare module 'react-navigation-props-mapper' {
  import * as React from 'react';

  export const withMappedNavigationParams: withMappedNavigationParamsDecorator;

  interface withMappedNavigationParamsDecorator {
    (SecondOrderWrapperComponent: React.ReactNode): WrappedComponent;
  }

  type WrappedComponent = {
    (target: React.ReactNode): any;
  };
}
