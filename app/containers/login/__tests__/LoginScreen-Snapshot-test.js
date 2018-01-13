jest.mock('native-toaster', () => () => {
  show : jest.fn()
});

import React from 'react';
import renderer from 'react-test-renderer';

import { LoginScreen } from '../LoginScreen';

it('renders a LoginScreen using Snapshots', () => {
  
  const _getComponent = (props) => {
    return (
      renderer.create(
        <LoginScreen
          auth={props}
          tryAutoLogin={jest.fn()}
        />
      )
    )
  };
  
  //let component = _getComponent({ loginForm : {} });
  //expect(component).toMatchSnapshot();

  let component = _getComponent({ loginForm : {email : "user1@mol42.com", password : "1234"} });
  expect(component).toMatchSnapshot();
});
