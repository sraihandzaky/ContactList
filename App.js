import React from 'react';
import {StyleSheet} from 'react-native';
import StackNavigation from './src/Navigation/StackNavigation';
import {store} from './src/Redux/Store';
import {Provider} from 'react-redux';

const App = props => {
  return (
    <Provider store={store}>
      <StackNavigation />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export default App;
