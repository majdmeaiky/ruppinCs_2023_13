import React, { useContext, useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItem, DrawerItemList, item } from '@react-navigation/drawer';
import { ImageBackground, View, Image, Text } from 'react-native';
import { Context } from '../Components/FCContext'
import { Icon } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';

export default function CustomDrawer(props) {
  const { logInWorker, setlogInWorker, workers, setWorkers } = useContext(Context);
  const [imageFound, setImageFound] = useState(false);

  // useEffect(() => {
  // console.log(logInWorker.Image);
  // })

  // const getImagesInDirectory = async () => {
  //   const rootDirectory = FileSystem.documentDirectory;
  //   const directoryName = logInWorker.Company_Name;
  //   const directoryPath = `${rootDirectory}${directoryName}`;
  //   const directoryContents = await FileSystem.readDirectoryAsync(directoryPath);
  //   const imageFiles = directoryContents.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  //   return imageFiles;
  // };

  // useEffect(() => {
  //   const getImageFiles = async () => {
  //     if (logInWorker) {
  //       const images = await getImagesInDirectory();
  //       images.map((image) => {
  //         const id = image.split('.')[0];
  //         if (parseInt(id) == logInWorker.Worker_Id) {
  //           setImageFound(true);
  //           const rootDirectory = FileSystem.documentDirectory;
  //           const directoryName = logInWorker.Company_Name;
  //           const fileName = image // the file name of the image you want to display
  //           const filePath = `${rootDirectory}${directoryName}/${fileName}`;

  //           setlogInWorker({
  //             ...logInWorker, // copy the current state object
  //             ["Image"]: filePath,
  //           });

  //         }
  //       })
  //       // console.log(images);
  //       // console.log(logInWorker.Image);
  //     }
  //   };

  //   getImageFiles();
  // },);

  const navigation = useNavigation();

  function handleLogout() {
    // Call your logout API or clear the user token here
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
{/* make it in one if!!!!!!!!!! */}
            {logInWorker && logInWorker.Is_Manager === true &&
            <View>

              < DrawerItem
                label="AllWorkers"
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
              onPress={() => handleLogout()}/>
          
            


            {/* <DrawerItem
              label="Settings"
              onPress={() => props.navigation.navigate('Settings')}
            /> */}
          </View>
        
     

          <DrawerItemList {...props} />

        </View>
      </DrawerContentScrollView>
    </View>
  )
}
