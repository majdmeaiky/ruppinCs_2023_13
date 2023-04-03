import React, { useState, useContext, useEffect } from 'react'
import { ScrollView, StyleSheet, SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import Header from '../Components/Header';
import { Card, Overlay } from '@rneui/themed';
import { SearchBar } from '@rneui/base';

import { Context } from '../Components/FCContext'
import ButtonAddNewWorker from '../Components/ButtonAddNewWorker';
import WorkerDetails from '../Components/WorkerDetails';

export default function AllWorkers() {
  const [search, setSearch] = useState('');
  const [vieworkerVisible, setVieworkerVisible] = useState(false);

  const { logInWorker, workers, setWorkers, apiUrl } = useContext(Context);
  const [selectedWorker, setSelectedWorker] = useState();


  ///////////////////////// showing the overlay when clicking on worker card
  const toggleOverlayVieWorker = (worker) => {
    setSelectedWorker(worker);
    setVieworkerVisible(!vieworkerVisible);
  };

  /////////////////////////// get all workers for the first time
  useEffect(() => {
    fetch(apiUrl + `Workers?Company_Code=${logInWorker.Company_Code}`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json; charset=UTF-8',
        'Content-Type': 'application/json; charset=UTF-8',

      }),
    })
      .then(res => {
        return res.json()
      })
      .then((data) => {
        setWorkers(data);

      })

      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  ////////////////////// making responsive workers array to handle search bar
  const filteredWorkers = search ?
    workers.filter((worker) => worker.Name.includes(search)) :
    workers;

  ////////////////// mapping a cards for all workers that reponse for the search bar
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

        {/* add worker component */}
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

        <Overlay isVisible={vieworkerVisible} onBackdropPress={toggleOverlayVieWorker} overlayStyle={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <WorkerDetails worker={selectedWorker} ondeleteWorker={toggleOverlayVieWorker}></WorkerDetails>
        </Overlay>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, marginTop: -720 }
});