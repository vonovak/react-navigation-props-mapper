import renderer from 'react-test-renderer';
import React from 'react';
import { withMappedNavigationParams } from '../index';
import { Text } from 'react-native';

function TestComponent({ drink }) {
  return <Text>I love {drink}</Text>;
}

const mockRouteProp = Object.freeze({ params: { drink: 'soda' } });

describe('withMappedNavigationParams()', () => {
  let testedInstance, EnhancedComponent;

  beforeEach(() => {
    EnhancedComponent = withMappedNavigationParams()(TestComponent);
    testedInstance = renderer.create(<EnhancedComponent route={mockRouteProp} />);
  });

  describe('regardless of SecondOrderWrapperComponent', () => {
    it('drink prop is passed from route params to standard component prop', () => {
      expect(testedInstance.toJSON()).toMatchInlineSnapshot(`
<Text>
  I love 
  soda
</Text>
`);
    });

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
      testedInstance = renderer.create(<EnhancedComponent route={mockRouteProp} />);

      expect(testedInstance.toJSON()).toMatchInlineSnapshot(`
<Text>
  I love 
  coke
</Text>
`);
    }
  );
});
