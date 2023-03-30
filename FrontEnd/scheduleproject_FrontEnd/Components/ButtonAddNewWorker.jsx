import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { Button, Card,Overlay } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import EvilIcon from '@expo/vector-icons/EvilIcons'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Context } from '../Components/FCContext'
import { useNavigation } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { CheckBox } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'

export default function ButtonAddNewWorker() {
  // const [addworkerVisible, setAddworkerVisible] = useState(false);
  const { addworkerVisible, setAddworkerVisible } = useContext(Context);

  const { logInWorker, setlogInWorker, workers, setWorkers,apiUrl } = useContext(Context);
const [scheduleStr, setScheduleStr] = useState('');
  const [datepicked, setdatepicked] = useState();
  const [datepickedString, setdatepickedString] = useState("started working on:");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // input sates
  const [check, setcheck] = useState(false);
  const [image, setImage] = useState('');
  const [worker_Id, setWorker_Id] = useState('');
  const [full_name, setFull_name] = useState("");
  const [email, setEmail] = useState("");
  const [base64, setBase64] = useState('');





  const pickImage = async () => {
    // await clearDirectory();
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.001,
      base64: true

    });
    console.log(result);
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setBase64(result.assets[0].base64);
      // await saveImage(imageUri, workerId);
      setImage(imageUri);
      // setUploaded(true);
      // await getImage();

    }
  };

  const addNewWorker = async () => {
    if (!worker_Id || !full_name || !email || !datepicked || !base64) {
      alert('Please fill out all required fields');
      return;
    }
  
    const worker = {
      "Worker_Id": worker_Id,
      "Name": full_name,
      "Email": email,
      "Start_Date": datepicked,
      "Is_Manager": check,
      "Company_Code": logInWorker.Company_Code,
      "Company_Name": logInWorker.Company_Name,
      "Shift_Id": -1,
      "Image": base64
    };
    console.log(worker);
    fetch(apiUrl+`Workers/AddWorker`, {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json; charset=UTF-8',
        'Content-Type': 'application/json; charset=UTF-8',

      }),
      body: JSON.stringify(worker),

    })
      .then((data) => {
        // alert('worker added successfuly')
        setWorker_Id('');
        setFull_name('');
        setEmail('');
        setdatepicked();
        setcheck(false);
setImage('');

setScheduleStr(<AwesomeAlert
  show={true}
  title="New Worker Added"
  message="Successfuly!"
/>)
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
            console.log(data);
            setWorkers(data);
            setAddworkerVisible(!addworkerVisible);
            setScheduleStr(<AwesomeAlert
              show={false}
              title="New Worker Added"
              message="Successfuly!"
            />)
            
          })

          .catch((error) => {
            console.error('Error:', error);

          });
      })

      .catch((error) => {
        console.error('Error:', error);

      });

  };


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setdatepicked(date);
    setdatepickedString(date.toDateString())
    hideDatePicker();
  };


const toggleOverlayAddWorker = () => {
  setAddworkerVisible(!addworkerVisible);
};

  return (
    <View>
    <Button
    title="Add Worker"
    icon={{ name: 'plus', type: 'font-awesome', size: 15, color: 'white', }}
    iconLeft
    iconContainerStyle={{ marginLeft: -20 }}
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
      alignSelf: 'center'
      
    }}
   onPress={toggleOverlayAddWorker}
  />
  <Overlay isVisible={addworkerVisible} onBackdropPress={toggleOverlayAddWorker} overlayStyle={{ position: 'absolute', bottom: 0, width: '100%' }}>
  <View style={styles.container}>

<View>
  <Text style={styles.HeaderTXT}>Add Worker</Text>
</View>
<View style={styles.container}>
  <TouchableOpacity onPress={() => worker_Id ? pickImage():alert('You Have To Enter ID First')}>
    {!image && <Image source={require('../assets/avatar.jpeg')} style={styles.image} />}
    {image && <Image source={{ uri: image }} style={styles.imagePicked} />}
  </TouchableOpacity>

</View>

<Input
  placeholder='ID' 
  value={worker_Id}
  onChangeText={setWorker_Id}
  inputStyle={{ color: 'grey' }}

  leftIcon={
    <EvilIcon name='credit-card' size={25} color='#00BFFF' />
  }
/>

<Input
  placeholder='Full Name'
  value={full_name}
  onChangeText={setFull_name}
  inputStyle={{ color: 'grey' }}
  leftIcon={
    <EvilIcon name='user' size={25} color='#00BFFF' />
  }
/>

<Input
  placeholder='Email'
  value={email}
  onChangeText={setEmail}
  inputStyle={{ color: 'grey' }}
  leftIcon={
    <EvilIcon name='envelope' size={25} color='#00BFFF' />
  }
/>
<TouchableOpacity onPress={showDatePicker}>
  <Input
    disabledInputStyle={{ color: 'black' }}
    value={datepickedString}
    disabled={true}
    leftIcon={
      <EvilIcon name='calendar' size={25} color='#00BFFF' />
    }
    onPressIn={showDatePicker}
  />
</TouchableOpacity>
<DateTimePickerModal
  isVisible={isDatePickerVisible}
  mode="date"
  onConfirm={handleConfirm}
  onCancel={hideDatePicker}
  textColor="#000000"
/>
<CheckBox
  title='Check If Manager'
textStyle={{color:'grey'}}
  checked={check}
  onIconPress={() => setcheck(!check)}
  checkedColor='#00BFFF'
  containerStyle={{ backgroundColor: 'none', borderWidth: 0, borderBottomColor: 'gray', borderBottomWidth: 1 }}
  uncheckedColor='#00BFFF'
/>

<Button
  title="Submit"
  iconLeft
  iconContainerStyle={{ marginLeft: -20 }}
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
    alignSelf: 'center'
  }}
  onPress={addNewWorker}
/>
{scheduleStr}
</View>
</Overlay>
</View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 10,

  },
  HeaderTXT: {
    textAlign: 'center',
    color: '#00BFFF',
    fontSize: 20
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 30,
    marginBottom: 30,
    alignSelf: 'center',
    borderRadius: 50,
    borderColor: 'lightgray',
    borderWidth: 2
  },
  imagePicked: {
    width: 100,
    height: 100,
    marginTop: 30,
    marginBottom: 30,
    alignSelf: 'center',
    borderRadius: 50,
    borderColor: '#00BFFF',
    borderWidth: 2

  }

});