declare module 'react-navigation-props-mapper' {
  import * as React from 'react';

  export const withMappedNavigationProps: withMappedNavigationPropsDecorator;

  interface withMappedNavigationPropsDecorator {
    (SecondOrderWrapperComponent: React.ReactNode): WrappedComponent;
  }

  type WrappedComponent = {
    (target: React.ReactNode): any;
  };
}
