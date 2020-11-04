import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';

const SplashScreen = props => {
  return (
    <View style={styles.container}>
      <Text>Splash Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
