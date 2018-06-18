import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

export const withMappedNavigationProps = SecondOrderWrapperComponent => WrappedComponent => {
  const TargetComponent = props => {
    const params = props.navigation ? props.navigation.state.params : {};
    
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
