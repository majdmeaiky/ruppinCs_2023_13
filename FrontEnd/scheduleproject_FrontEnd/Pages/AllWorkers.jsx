import React, { useState, useContext, useEffect } from 'react'
import { ScrollView, StyleSheet, SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import Header from '../Components/Header';
import { Button, Card, Overlay } from '@rneui/themed';
import { SearchBar } from '@rneui/base';
// import WorkerDetails from '../Components/WorkerDetails';

import { Context } from '../Components/FCContext'
import ButtonAddNewWorker from '../Components/ButtonAddNewWorker';
import WorkerDetails from '../Components/WorkerDetails';
import { useFocusEffect } from '@react-navigation/native';

export default function AllWorkers() {
  const [search, setSearch] = useState('');
  const [vieworkerVisible, setVieworkerVisible] = useState(false);

  const { logInWorker, setlogInWorker, workers, setWorkers, addworkerVisible, setAddworkerVisible,apiUrl } = useContext(Context);
  const [selectedWorker, setSelectedWorker] = useState();
const [counter, setCounter] = useState(0);
  const toggleOverlayAddWorker = () => {
    setAddworkerVisible(!addworkerVisible);
  };


  const toggleOverlayVieWorker = (worker) => {
    setSelectedWorker(worker);
    setVieworkerVisible(!vieworkerVisible);
  };

  // useFocusEffect(()=>{
  //   fetch(`http://10.0.0.8:45455/api/Workers?Company_Code=${logInWorker.Company_Code}`, {
  //     method: 'GET',
  //     headers: new Headers({
  //       'Accept': 'application/json; charset=UTF-8',
  //       'Content-Type': 'application/json; charset=UTF-8',

  //     }),
  //     // body: JSON.stringify({ Company_Code }),

  //   })
  //     .then(res => {
  //       return res.json()
  //     })
  //     .then((data) => {
  //       // console.log(data);
  //       setWorkers(data);

  //     })

  //     .catch((error) => {
  //       console.error('Error:', error);

  //     });
  //   console.log('bvbyeee');

  // });

  useEffect(() => {
    fetch(apiUrl+`Workers?Company_Code=${logInWorker.Company_Code}`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json; charset=UTF-8',
        'Content-Type': 'application/json; charset=UTF-8',

      }),
      // body: JSON.stringify({ Company_Code }),

    })
      .then(res => {
        return res.json()
      })
      .then((data) => {
        // console.log(data);
        setWorkers(data);

      })

      .catch((error) => {
        console.error('Error:', error);

      });
    console.log('bvbyeee');
  }, [])

  const filteredWorkers = search ? 
  workers.filter((worker) => worker.Name.includes(search)) :
  workers;


  const workerStr = filteredWorkers.map((worker) =>
    <TouchableOpacity onPress={() => { toggleOverlayVieWorker(worker) }}>
      <Card containerStyle={{ borderRadius: 10, height: 200, width: 170, margin: 22 }} >
        <View style={{ flexDirection: 'column', height: '100%' }}>
          <Image
            style={{ height: '80%' }}
            source={{ uri: `data:image/png;base64,${worker.Image}` }}
          />

          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 25, marginTop: 10 }}>
              {worker.Name}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
  <ScrollView scrollEnabled={false}>
      <Header></Header>
      </ScrollView>

      <View style={styles.container}>

      <ButtonAddNewWorker></ButtonAddNewWorker>

      <SearchBar inputStyle={{ backgroundColor: 'white' }}
        containerStyle={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 5, margin: 10, width: 350, alignSelf: 'center' }}
        onChangeText={setSearch}
        value={search}
      />
<ScrollView>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {workerStr}
      </View>
      </ScrollView>
      <Overlay isVisible={addworkerVisible} onBackdropPress={toggleOverlayAddWorker} overlayStyle={{ position: 'absolute', bottom: 0, width: '100%' }}>
<ButtonAddNewWorker></ButtonAddNewWorker>            
          </Overlay>

          <Overlay isVisible={vieworkerVisible} onBackdropPress={toggleOverlayVieWorker} overlayStyle={{ position: 'absolute', bottom: 0, width: '100%' }}>
            <WorkerDetails worker={selectedWorker}></WorkerDetails>
          </Overlay>
    </View>
</SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1,marginTop:-720 }
});