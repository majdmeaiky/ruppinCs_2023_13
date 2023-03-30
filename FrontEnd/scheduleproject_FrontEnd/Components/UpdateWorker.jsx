import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { Button, Card } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import EvilIcon from '@expo/vector-icons/EvilIcons'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Context } from './FCContext'

// install react-native-modal-datetime-picker
//install react-native-community
import { CheckBox } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';

//import TextDate from './Pages/TextDate';

export default function UpdateWorker(props) {

  const { logInWorker, setlogInWorker, workers, setWorkers,apiUrl } = useContext(Context);

  const [datepicked, setdatepicked] = useState(props.worker.Start_Date);
  const [datepickedString, setdatepickedString] = useState(FormatDate(datepicked));

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // input sates
  const [check, setcheck] = useState(props.worker.Is_Manager == 0 ? true : false);
  const [image, setImage] = useState(props.worker.Image);
  const [worker_Id, setWorker_Id] = useState(props.worker.Worker_Id);
  const [full_name, setFull_name] = useState(props.worker.Name);
  const [email, setEmail] = useState(props.worker.Email);





  // const createDirectory = async () => {
  //   const rootDirectory = FileSystem.documentDirectory;
  //   const directoryName = logInWorker.Company_Name;
  //   const directoryPath = `${rootDirectory}${directoryName}`;
  //   const directoryExists = await FileSystem.getInfoAsync(directoryPath);
  //   if (!directoryExists.exists) {
  //     await FileSystem.makeDirectoryAsync(directoryPath, { intermediates: true });
  //     console.log(`Directory created at: ${directoryPath}`);

  //   }
  //   else {
  //     console.log('directory found');
  //     const directoryContents = await FileSystem.readDirectoryAsync(directoryPath);
  //     const imageFiles = directoryContents.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  //     console.log(`Found ${imageFiles.length} images in directory: ${directoryPath}`);
  //     console.log(imageFiles[0]);

  //   }
  // };

  // const saveImage = async (imageUri, workerId) => {
  //   const directory = `${FileSystem.documentDirectory}${logInWorker.Company_Name}`;
  //   const extension = imageUri.split(".").pop();
  //   const filename = `${workerId}.${extension}`;
  //   const newPath = `${directory}/${filename}`;

  //   const fileInfo = await FileSystem.getInfoAsync(newPath);
  //   if (fileInfo.exists) {
  //     return;
  //   } else {
  //     await FileSystem.copyAsync({
  //       from: imageUri,
  //       to: newPath,
  //     });

  //   }
  // };



  // const getImage = async () => {
  //   const directory = `${FileSystem.documentDirectory}${logInWorker.Company_Name}`;
  //   const imageArray = await FileSystem.readDirectoryAsync(directory);
  //   const imageFile = imageArray[0];
  //   const imageUri = `${directory}/${imageFile}`;
  //   setImage(imageUri);
  // };


  const pickImage = async () => {
    // await createDirectory();
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      // await saveImage(imageUri, workerId);
      setImage(imageUri);
      // setUploaded(true);
      // await getImage();

    }
  };


  const UpdateWorker = async () => {
    // if (image != '') {
    //   await saveImage(image, worker_Id);
    // }
    const worker = {
      "Worker_Id": worker_Id,
      "Name": full_name,
      "Email": email,
      "Start_Date": datepicked,
      "Is_Manager": check,
      "Company_Code": logInWorker.Company_Code,
      //"Image": base64
    };
    console.log(worker);
    fetch(apiUrl+`Workers`, {
      method: 'PUT',
      headers: new Headers({
        'Accept': 'application/json; charset=UTF-8',
        'Content-Type': 'application/json; charset=UTF-8',

      }),
      body: JSON.stringify(worker),

    })
      .then(res => {
      })
      .then((data) => {
        alert('worker added successfuly')
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


  function OnDateSelected(event, value) {
    console.log(event);
    console.log(value);

    if (event.type != 'dismissed') {
      setdate(value);
    }
    setdatePicker(false);
  }

  function FormatDate (got_date)
  {
      const date = new Date(got_date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const formattedMonth = String(month).padStart(2, "0");
      const formattedday = String(day).padStart(2, "0");
      const formattedDate = `${year}/${formattedMonth}/${formattedday}`;
      return formattedDate;
  }

  return (

    <View style={styles.container}>
      <View>
        <Text style={styles.HeaderTXT}>Update Worker</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => worker_Id ? pickImage() : alert('aa')}>
          {!image && <Image source={require('../assets/avatar.jpeg')} style={styles.image} />}
          {image &&             <Image source={{ uri: `data:image/png;base64,${props.worker.Image}` }} style={styles.image} />
}
        </TouchableOpacity>
      </View>

      <Input
        //placeholder='ID'
        disabled={true}
        disabledInputStyle={{ color: '#000000' }}
        inputStyle={{ color: '#000000' }}
        value={worker_Id.toString()}
        leftIcon={
          <EvilIcon name='credit-card' size={25} color='grey' />

        }
      />

      <Input
        placeholder='Full Name'
        value={full_name}
        disabledInputStyle={{ color: '#000000' }}
        inputStyle={{ color: '#000000' }}
        disabled={true}
        onChangeText={setFull_name}

        leftIcon={
          <EvilIcon name='user' size={25} color='grey' />
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
        title='check if maneger'
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
        onPress={UpdateWorker}
      />
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

