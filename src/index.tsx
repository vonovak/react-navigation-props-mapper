import React, { ComponentType } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import type {
  ForwardedScreenProps,
  NavigationAndRoute,
  RestrictedParamListBase,
  SecondOrderWrapperType,
  WithForwardedNavigationParamsReturn,
  ParamListKeyType,
} from './types';
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
  // todo should these extend ForwardedXYZ or just XYZ?
  ScreenProps extends ForwardedScreenProps<ParamList, RouteName>,
  ParamList extends RestrictedParamListBase,
  RouteName extends keyof ParamList = string
>(SecondOrderWrapperComponent?: SecondOrderWrapperType<ScreenProps>) {
  return function (WrappedComponent: ComponentType<ScreenProps>) {
    const TargetComponent = (props: NavigationAndRoute<ScreenProps>) => {
      const { params } = props.route;

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
