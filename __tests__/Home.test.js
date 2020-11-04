import react from 'react';
import {render} from '@testing-library/react-native';
import HomeScreen from './../src/Screen/HomeScreen';
import NewContactScreen from './../src/Screen/NewContactScreen';
import ProfileScreen from './../src/Screen/ProfileScreen';

test('render Home Components Properly', () => {
  const {debug} = render(<HomeScreen />);
  debug();
});
