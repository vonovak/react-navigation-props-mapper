import React, { ComponentType } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import type {
  ForwardedScreenProps,
  NavigationAndRoute,
  SecondOrderWrapperType,
  WithForwardedNavigationParamsReturn,
  ParamListKeyType,
} from './types';
import type { ParamListBase } from '@react-navigation/core';
export * from './types';

export function withForwardedNavigationParams<
  ScreenProps extends ForwardedScreenProps<any, ScreenProps['route']['name']>
>(
  SecondOrderWrapperComponent?: SecondOrderWrapperType<ScreenProps>
): WithForwardedNavigationParamsReturn<ScreenProps> {
  return function (WrappedComponent) {
    const TargetWithHoistedStatics = forwardNavigationParams<
      ScreenProps,
      ScreenProps[ParamListKeyType],
      ScreenProps['route']['name']
    >(SecondOrderWrapperComponent)(WrappedComponent);

    return TargetWithHoistedStatics;
  };
}

export function forwardNavigationParams<
  ScreenProps extends ForwardedScreenProps<ParamList, RouteName>,
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
>(SecondOrderWrapperComponent?: SecondOrderWrapperType<ScreenProps>) {
  return function (WrappedComponent: ComponentType<ScreenProps>) {
    const TargetComponent = (props: NavigationAndRoute<ScreenProps>) => {
      const params = props?.route && props.route.params;

      if (!SecondOrderWrapperComponent) {
        return <WrappedComponent {...props} {...params} />;
      } else {
        return (
          <SecondOrderWrapperComponent
            WrappedComponent={WrappedComponent}
            {...props}
            {...params}
          />
        );
      }
    };

    TargetComponent.displayName = `withForwardedNavigationParams(${
      WrappedComponent.displayName || WrappedComponent.name
    })`;

    hoistNonReactStatics(TargetComponent, WrappedComponent);
    TargetComponent.wrappedComponent = WrappedComponent;
    return TargetComponent;
  };
}
