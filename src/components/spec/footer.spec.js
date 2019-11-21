import React from 'react';
import { shallow } from 'enzyme';

import Footer from 'src/components/footer';

describe('Footer', () => {
  it('should render provided content', () => {
    const component = shallow(<Footer content="Built By People" />);
    expect(component.containsMatchingElement(
      <div>Built By People</div>
    )).toBeTruthy();
  });
});
