import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import 'react-native-get-random-values';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import TodoScreen from './src/screens/todoScreen';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <TodoScreen />
      </SafeAreaView>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
