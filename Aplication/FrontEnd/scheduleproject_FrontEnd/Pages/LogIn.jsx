import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { Context } from '../Components/FCContext'

export default function LogIn() {
  const navigation = useNavigation();
  const [Worker_Id, setWorker_Id] = useState();
  const [Company_Code, setCompany_Code] = useState('');
  const { setlogInWorker, apiUrl } = useContext(Context);
  const [isValid, setIsValid] = useState(true);

  const checkLogIn = () => {

    const Name = '';
    const Email = '';
    const Start_Date = '';
    const Is_Manager = '';
    const Image = '';
    const Company_Name = '';
    const Shift_Id = -1;

    const worker = { Worker_Id, Name, Email, Start_Date, Is_Manager, Company_Code, Company_Name, Image, Shift_Id };
    fetch(apiUrl + 'Workers', {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json; charset=UTF-8',
        'Content-Type': 'application/json; charset=UTF-8',

      }),
      body: JSON.stringify(worker),
    })
      .then(res => {
        return res.json()
      })
      .then((data) => {
        setlogInWorker(data);
        if (data.Company_Code) {
          navigation.navigate('Menu');
          setWorker_Id();
          setCompany_Code('');
          setIsValid(true);

        }
        else {
          setIsValid(!isValid)
          setWorker_Id();
          setCompany_Code('');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <Image
          source={require('../fair-schedule-logo.png')}
          style={{ width: '100%', height: 300 }}
        />
        <TextInput

          style={[
            styles.input,
            !isValid && { borderColor: 'red', borderWidth: '1' } // set border color to red if input is invalid
          ]}
          placeholder='Enter Your ID'
          onChangeText={setWorker_Id}
          value={Worker_Id}
        />

        <TextInput
          style={[
            styles.input,
            !isValid && { borderColor: 'red', borderWidth: '1' } // set border color to red if input is invalid
          ]}
          placeholder='Enter Company Code'
          onChangeText={setCompany_Code}
          value={Company_Code}

        />
        {!isValid && <Text style={{ fontSize: 15, alignSelf: 'center' }}>*Invalid User*</Text>}
        <Button
          title="LOGIN"
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: '#00BFFF',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30,
          }}
          containerStyle={{
            width: 200,
            marginHorizontal: 50,
            marginVertical: 20,
            alignSelf: 'center',
            marginTop: 50
          }}
          onPress={checkLogIn}
        />
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    height: 60,
    marginTop: 30,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20
  },
});