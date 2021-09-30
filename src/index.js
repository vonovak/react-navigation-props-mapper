import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export const withMappedNavigationParams = SecondOrderWrapperComponent => WrappedComponent => {
  const TargetWithHoistedStatics = mapNavigationProps(SecondOrderWrapperComponent)(
    WrappedComponent
  );

  return TargetWithHoistedStatics;
};

export const mapNavigationProps = SecondOrderWrapperComponent => WrappedComponent => {
  const TargetComponent = props => {
    const params = props?.route?.params ?? {};

    if (!SecondOrderWrapperComponent) {
      return <WrappedComponent {...props} {...params} />;
    } else {
      return (
        <SecondOrderWrapperComponent WrappedComponent={WrappedComponent} {...props} {...params} />
      );
    }
  };

  TargetComponent.displayName = `withMappedNavigationParams(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  hoistNonReactStatics(TargetComponent, WrappedComponent);
  TargetComponent.wrappedComponent = WrappedComponent;
  return TargetComponent;
};
