import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

const SplashScreen = props => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('./../../assets/appIcon.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8B195',
  },
  image: {
    width: 350,
    height: 350,
    marginTop: -100,
  },
});

export default SplashScreen;
