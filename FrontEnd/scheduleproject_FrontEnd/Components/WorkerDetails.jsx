import React, { useEffect, useState,useContext } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { Button, Card } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import EvilIcon from '@expo/vector-icons/EvilIcons'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AwesomeAlert from 'react-native-awesome-alerts';
//install react-native-community
import { CheckBox } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import { Context } from './FCContext'
//import TextDate from './Pages/TextDate';
import {Overlay } from '@rneui/themed';
import UpdateWorker from './UpdateWorker';
export default function AddWorker(props) {


    const [datepicked, setdatepicked] = useState();
    const [datepickedString, setdatepickedString] = useState("started working on:");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    // input sates
    const [check, setcheck] = useState(false);
    const [image, setImage] = useState('');
    const [worker_Id, seWorker_Id] = useState("");
    const [full_name, setFull_name] = useState("");
    const [email, setEmail] = useState("");
    const { logInWorker,workers, setWorkers,apiUrl} = useContext(Context);
    const [updateWorkerVisible, setUpdateWorkerVisible] = useState(false);
    const [scheduleStr, setScheduleStr] = useState('');

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

const DeleteWorker = ()=>{
    const id = props.worker.Worker_Id;
    const Company_Code = logInWorker.Company_Code;
    fetch(apiUrl+'Workers?Worker_Id='+id+'&Company_Code='+Company_Code    , {
        method: 'DELETE',
        headers: new Headers({
            'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
    
        }),
        
      })
        .then(res => {
          console.log(res);
        })
        .then((data) => {
            setScheduleStr(<AwesomeAlert
                show={true}
                title="Worker Deleted"
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
                  // console.log(data);
                  setWorkers(data);
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
}


const toggleOverlayUpdateWorker = () => {
    setUpdateWorkerVisible(!updateWorkerVisible);
  };

    return (

        <View style={styles.container}>
        <View>
        <Text style={styles.HeaderTXT}>Worker Details</Text>
      </View>
            
            <Image source={{ uri: `data:image/png;base64,${props.worker.Image}` }} style={styles.image} />
            <View style={styles.Detailview}>
                <Text style={styles.Label}>ID - </Text>
                <Text style={styles.DetailTxt}>{props.worker.Worker_Id}</Text>
            </View>
            <View style={styles.Detailview}>
            <Text style={styles.Label}>NAME - </Text>
                <Text style={styles.DetailTxt}>{props.worker.Name}</Text>
            </View>
            <View style={styles.Detailview}>
            <Text style={styles.Label}>EMAIL - </Text>
                <Text style={styles.DetailTxt}>{props.worker.Email}</Text>
            </View>
            <View style={styles.Detailview}>
            <Text style={styles.Label}>STARTED AT - </Text>
                <Text style={styles.DetailTxt}>{FormatDate(props.worker.Start_Date)}</Text>
            </View>
            <View style={styles.Detailview}>
            <Text style={styles.Label}>STATUS - </Text>
                <Text style={styles.DetailTxt}>
                    {props.worker.Is_Manager === 1 ? 'Manager' : 'Not Manager'}
                </Text>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity style={{ marginRight: '20%' }} onPress={toggleOverlayUpdateWorker}>
                    <EvilIcon name='pencil' size={70} color='#00BFFF'></EvilIcon>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: '20%' }} onPress={DeleteWorker}>
                    <EvilIcon name='trash' size={70} color='red' ></EvilIcon>
                </TouchableOpacity>
            </View>

            <Overlay isVisible={updateWorkerVisible} onBackdropPress={toggleOverlayUpdateWorker} overlayStyle={{ position: 'absolute', bottom: 0, width: '100%' }}>
            <UpdateWorker worker={props.worker}></UpdateWorker>

          </Overlay>
          {scheduleStr}

        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        alignItems: 'center'

    },
    Detailview: {
        // borderColor:'lightgray',
        // borderWidth:1,
        backgroundColor: '#E2F8F9',
        borderRadius: 10,
        marginBottom: 20,
        width: '90%',
        height: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
        flexDirection:'row',
        justifyContent:'center'
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 30,
        marginBottom: 30,
        alignSelf: 'center',
        borderRadius: 50,
        borderColor: '#00BFFF',
        borderWidth: 2

    },
    HeaderTXT: {
        textAlign: 'center',
        color: '#00BFFF',
        fontSize: 20
      },
      Label:{
       fontWeight:'bold',
       alignSelf:'center',
       color:'#00BFFF',
       fontSize:15

      },
      DetailTxt:{
        alignSelf:'center',
        fontSize:15
      }
});

