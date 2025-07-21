import { SafeAreaView, StatusBar, View, Platform } from 'react-native'
import React from 'react'
import LinearGradient  from 'react-native-linear-gradient'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import RootNavigator from './src/navigation/RootNavigator'


const App = () => {
  
  return (
    <Provider store={store}>
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: '#0b0866' }} />
      )}
      <StatusBar 
        backgroundColor="#0b0866" 
        style="light" 
        barStyle={"light-content"} 
        hidden={false} 
        translucent={true} 
      />
    <LinearGradient
      colors={['#7ad6f0', '#ffffff']}
      style={{ flex: 1 }}
    >
        <SafeAreaView style={{ flex: 1 }}>
          <RootNavigator />
      </SafeAreaView>
    </LinearGradient>
    </Provider>
  )
}

export default App