declare module 'react-navigation-props-mapper' {
	import * as React from "react";

  export const withMappedNavigationProps: withMappedNavigationPropsDecorator;

  export const withMappedNavigationAndConfigProps: withMappedNavigationAndConfigPropsDecorator;


  interface withMappedNavigationAndConfigPropsDecorator {
    (SecondOrderWrapperComponent: React.ReactNode): WrappedComponent;
  }

  interface withMappedNavigationPropsDecorator {
    (): WrappedComponent;
  }

  type WrappedComponent = {
    (target: React.ReactNode): any;
  }
}