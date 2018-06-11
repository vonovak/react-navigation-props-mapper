import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

const get = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)

export const withMappedNavigationProps = SecondOrderWrapperComponent => WrappedComponent => {
  const TargetComponent = props => {
    const params = get(['navigation', 'state', 'params'], props) || {};
    
    const { screenProps, ...propsExceptScreenProps } = props;

    if (!SecondOrderWrapperComponent) {
      return <WrappedComponent {...screenProps} {...propsExceptScreenProps} {...params} />;
    } else {
      return (
        <SecondOrderWrapperComponent
          WrappedComponent={WrappedComponent}
          {...screenProps}
          {...propsExceptScreenProps}
          {...params}
        />
      );
    }
  };

  TargetComponent.displayName = `withMappedNavigationProps(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  return hoistNonReactStatic(TargetComponent, WrappedComponent);
};

export const withMappedNavigationAndConfigProps = SecondOrderWrapperComponent => WrappedComponent => {
  const TargetWithHoistedStatics = withMappedNavigationProps(SecondOrderWrapperComponent)(
    WrappedComponent
  );

  if (typeof WrappedComponent.navigationOptions === 'function') {
    TargetWithHoistedStatics.navigationOptions = navigationProps =>
      mapScreenConfigProps(navigationProps, WrappedComponent.navigationOptions);
  }

  return TargetWithHoistedStatics;
};

export function mapScreenConfigProps(reactNavigationProps, navigationOptionsFunction) {
  const { navigation, screenProps, navigationOptions } = reactNavigationProps;
  const props = { ...screenProps, ...navigation.state.params, navigationOptions, navigation };
  return navigationOptionsFunction(props);
}
