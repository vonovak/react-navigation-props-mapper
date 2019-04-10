import * as React from "react";

declare module "react-navigation-props-mapper" {
  export function withMappedNavigationParams<T>(SecondOrderWrapperComponent?: React.ReactNode): WrappedComponent<T>;

  interface WrappedComponent<T extends React.ReactNode> {
    (target: T): TargetComponent<T>;
  }

  interface TargetComponent<T> extends React.FC {
    wrappedComponent: T
  }
}
