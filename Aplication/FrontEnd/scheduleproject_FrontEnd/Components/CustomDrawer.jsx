import React, { useContext, useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItem, DrawerItemList, item } from '@react-navigation/drawer';
import { ImageBackground, View, Image, Text } from 'react-native';
import { Context } from '../Components/FCContext'
import { useNavigation } from '@react-navigation/native';

export default function CustomDrawer(props) {
  const { logInWorker } = useContext(Context);


  const navigation = useNavigation();

  function handleLogout() {
    navigation.resetRoot({
      index: 0,
      routes: [{ name: 'LogIn' }],
    });
  }

  return (
    <View style={{ flex: 1 }} source={require('../abstract-grunge-decorative-relief-navy-blue-stucco-wall-texture-wide-angle-rough-colored-background.jpg')}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#0186FF' }}>
        <ImageBackground source={require('../blue.jpeg')} style={{ padding: 20, }}>
          {logInWorker != undefined &&
            <View>
              {logInWorker && <Image source={{ uri: `data:image/png;base64,${logInWorker.Image}` }} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />}
              {!logInWorker && <Image source={require('../user.jpg')} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />}
              <Text style={{ color: '#fff', fontSize: 18 }}>{logInWorker.Name}</Text>
            </View>
          }

        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          {/* {logInWorker && logInWorker.isManager!==0 ? ( */}
          <View>
            <DrawerItem
              label="Home"
              onPress={() => props.navigation.navigate('Menu')}
            />
            {logInWorker && logInWorker.Is_Manager === true &&
              <View>

                < DrawerItem
                  label="Workers"
                  onPress={() => props.navigation.navigate('AllWorkers')}
                />

              </View>

            }

            {logInWorker && logInWorker.Is_Manager === false &&
              < DrawerItem
                label="AskRequest"
                onPress={() => props.navigation.navigate('AskRequest')}
              />}

            <DrawerItem
              label="Log Out"
              onPress={() => handleLogout()} />
          </View>


          <DrawerItemList {...props} />

        </View>
      </DrawerContentScrollView>
    </View>
  )
}
