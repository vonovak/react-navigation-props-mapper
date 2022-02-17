import renderer from 'react-test-renderer';
import React from 'react';
import { withForwardedNavigationParams } from '../index';
import { Text } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  ForwardedNativeStackScreenProps,
  SecondOrderWrapperType,
  WithForwardedNavigationParamsReturn,
} from '../types';

type RootStackParamList = {
  TestComponent: { drink: string };
};
type ForwardedTestComponentProps = ForwardedNativeStackScreenProps<
  RootStackParamList,
  'TestComponent'
>;

const mockRouteProp = {
  params: { drink: 'soda' },
  key: 'mockKey',
  name: 'TestComponent',
} as const;

const mockNavigationProp = {} as NativeStackNavigationProp<
  RootStackParamList,
  'TestComponent'
>;

function TestComponent({ drink }: ForwardedTestComponentProps) {
  return <Text>I love:{String(drink)}</Text>;
}

describe('withForwardedNavigationParams()', () => {
  let EnhancedComponent: ReturnType<
    WithForwardedNavigationParamsReturn<ForwardedTestComponentProps>
  >;

  beforeEach(() => {
    EnhancedComponent =
      withForwardedNavigationParams<ForwardedTestComponentProps>()(
        TestComponent
      );
  });

  describe('regardless of SecondOrderWrapperComponent', () => {
    it('drink prop is passed from route params to standard component prop', () => {
      const testedInstance = renderer.create(
        <EnhancedComponent
          route={mockRouteProp}
          navigation={mockNavigationProp}
        />
      );
      expect(testedInstance.toJSON()).toMatchInlineSnapshot(`
        <Text>
          I love:
          soda
        </Text>
      `);
    });

    it('wrappedComponent refers to the original component that we wrapped', () => {
      expect(EnhancedComponent.wrappedComponent).toBe(TestComponent);
    });

    it('EnhancedComponent can be used without being included in any navigator', () => {
      const testedInstance = renderer.create(
        // @ts-expect-error navigator props are missing - should not be used like this, but will not crash
        <EnhancedComponent />
      );

      expect(testedInstance.toJSON()).toMatchInlineSnapshot(`
        <Text>
          I love:
          undefined
        </Text>
      `);
    });
  });

  it(
    'given SecondOrderWrapperComponent that overrides the "drink" prop to "coke", ' +
      'WrappedComponent is rendered and the "drink" prop is overridden',
    () => {
      const SecondOrderWrapper: SecondOrderWrapperType<
        ForwardedTestComponentProps
      > = (props) => {
        const { WrappedComponent, ...other } = props;
        return <WrappedComponent {...other} drink="coke" />;
      };

      EnhancedComponent =
        withForwardedNavigationParams<ForwardedTestComponentProps>(
          SecondOrderWrapper
        )(TestComponent);

      const testedInstance = renderer.create(
        <EnhancedComponent
          route={mockRouteProp}
          navigation={mockNavigationProp}
        />
      );

      expect(testedInstance.toJSON()).toMatchInlineSnapshot(`
        <Text>
          I love:
          coke
        </Text>
      `);
    }
  );
});
