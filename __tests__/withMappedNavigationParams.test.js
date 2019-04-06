import renderer from 'react-test-renderer';
import React from 'react';
import { withMappedNavigationParams } from '../index';
import { Text } from 'react-native';

class TestComponent extends React.Component {
  static navigationOptions = ({ drink }) => ({
    title: drink,
  });

  render() {
    return <Text>I love {this.props.drink}</Text>;
  }
}

const mockNavProp = Object.freeze({ state: { params: { drink: 'soda' } } });

describe('withMappedNavigationParams()', () => {
  let testedInstance, EnhancedComponent;

  beforeEach(() => {
    EnhancedComponent = withMappedNavigationParams()(TestComponent);
    testedInstance = renderer.create(<EnhancedComponent navigation={mockNavProp} />);
  });

  describe('regardless of SecondOrderWrapperComponent', () => {
    it('drink prop is passed from navigation params to standard component prop', () => {
      expect(testedInstance.toJSON()).toMatchInlineSnapshot(`
<Text>
  I love 
  soda
</Text>
`);
    });

    it(
      'given that navigationOptions is a function ' +
        'the navigation params are directly accessible in it',
      () => {
        expect(EnhancedComponent.navigationOptions({ navigation: mockNavProp })).toEqual({
          title: 'soda',
        });
      }
    );

    it('wrappedComponent refers to the original component that we wrapped', () => {
      expect(EnhancedComponent.wrappedComponent).toBe(TestComponent);
    });
  });

  it(
    'given SecondOrderWrapperComponent that overrides the "drink" prop to "coke", ' +
      'WrappedComponent is rendered and the "drink" prop is overridden',
    () => {
      class SecondOrderWrapper extends React.Component {
        render() {
          const { WrappedComponent } = this.props;
          return <WrappedComponent drink="coke" />;
        }
      }

      EnhancedComponent = withMappedNavigationParams(SecondOrderWrapper)(TestComponent);
      testedInstance = renderer.create(<EnhancedComponent navigation={mockNavProp} />);

      expect(testedInstance.toJSON()).toMatchInlineSnapshot(`
<Text>
  I love 
  coke
</Text>
`);
    }
  );
});
