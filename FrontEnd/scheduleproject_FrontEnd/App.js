import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import Menu from './Pages/Menu';
import LogIn from './Pages/LogIn';
import CustomDrawer from './Components/CustomDrawer';
import AskRequest from './Pages/AskRequest';
import Settings from './Pages/Settings';
import AllWorkers from './Pages/AllWorkers';
import FCContextProvider from './Components/FCContext';
import Requests from './Components/Requests';

import { Icon } from '@rneui/base';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';


export default function App() {
  const Drawer = createDrawerNavigator();
  // const {logInWorker, setlogInWorker} = useContext(FCContextProvider);
  return (
    <FCContextProvider>

      <NavigationContainer>
        <Drawer.Navigator initialRouteName='LogIn' drawerContent={props => <CustomDrawer {...props} />} screenOptions={{ headerShown: false,  drawerActiveTintColor: '#fff' }} >
          <Drawer.Screen name="Menu" component={Menu} options={{ drawerLabel: () => null }} />
          <Drawer.Screen name="AskRequest" component={AskRequest}  options={{ drawerLabel: () => null }}/>
          <Drawer.Screen name="Settings" component={Settings} options={{ drawerLabel: () => null }} />
          <Drawer.Screen name="AllWorkers" component={AllWorkers} options={{ drawerLabel: () => null }} /> 
          <Drawer.Screen name="LogIn" component={LogIn} options={{ drawerLabel: () => null, swipeEnabled: false,  }} />
          <Drawer.Screen name="customDrawer" component={CustomDrawer} options={{ drawerLabel: () => null, swipeEnabled: false, }} />

        </Drawer.Navigator>
      </NavigationContainer>

    </FCContextProvider>
    
  );
}

const styles = StyleSheet.create({

});
