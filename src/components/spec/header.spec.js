import React from 'react';
import { shallow } from 'enzyme';

import Header from 'src/components/header';

describe('Header', () => {
  it('should render a unique title', () => {
    const component = shallow(<Header title="Campaign 1" />);
    expect(component.containsMatchingElement(<h1>Campaign 1</h1>)).toBeTruthy();
  });
});
