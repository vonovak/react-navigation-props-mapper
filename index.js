import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

export function withMappedNavigationProps(WrappedComponent) {
  const TargetComponent = props => {
    const { navigation: { state: { params } }, screenProps } = props;
    return <WrappedComponent {...props} {...params} {...screenProps} />;
  };

  WrappedComponent.displayName = `withMappedNavigationProps(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  return hoistNonReactStatic(TargetComponent, WrappedComponent);
}

export function withMappedNavigationAndConfigProps(WrappedComponent) {
  const TargetWithHoistedStatics = withMappedNavigationProps(WrappedComponent);

  if (typeof WrappedComponent.navigationOptions === 'function') {
    TargetWithHoistedStatics.navigationOptions = navigationProps =>
      mapScreenConfigProps(navigationProps, WrappedComponent.navigationOptions);
  }

  return TargetWithHoistedStatics;
}

export function mapScreenConfigProps(reactNavigationProps, routeConfigFunction) {
  const { navigation, screenProps, navigationOptions } = reactNavigationProps;
  const props = { ...navigation.state.params, ...screenProps, navigationOptions, navigation };
  return routeConfigFunction(props);
}
