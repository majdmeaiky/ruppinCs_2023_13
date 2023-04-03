import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import EvilIcon from '@expo/vector-icons/EvilIcons'
import AwesomeAlert from 'react-native-awesome-alerts';
import { Context } from './FCContext'
import { Overlay } from '@rneui/themed';
import UpdateWorker from './UpdateWorker';
export default function WorkerDetails(props) {

  const { ondeleteWorker } = props;
  const [worker, setWorker] = useState(props.worker);
  // input sates
  const { logInWorker, workers, setWorkers, apiUrl, weeklyCounter, setWeeklyCounter, schedules, setSchedules } = useContext(Context);
  const [updateWorkerVisible, setUpdateWorkerVisible] = useState(false);
  const [scheduleStr, setScheduleStr] = useState('');
  function FormatDate(got_date) {
    const date = new Date(got_date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedMonth = String(month).padStart(2, "0");
    const formattedday = String(day).padStart(2, "0");
    const formattedDate = `${year}/${formattedMonth}/${formattedday}`;
    return formattedDate;
  };

  //////////////// handle delete worker
  const DeleteWorker = () => {
    const id = worker.Worker_Id;
    const Company_Code = logInWorker.Company_Code;
    fetch(apiUrl + 'Workers?Worker_Id=' + id + '&Company_Code=' + Company_Code, {
      method: 'DELETE',
      headers: new Headers({
        'Accept': 'application/json; charset=UTF-8',
        'Content-Type': 'application/json; charset=UTF-8',
      }),

    })
      .then(res => {
      })
      .then((data) => {
        setScheduleStr(<AwesomeAlert
          show={true}
          title="Worker Deleted"
          message="Successfuly!"
        />)
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
            fetch(apiUrl + `Schedule?Company_Code=${logInWorker.Company_Code}&week_counter=${weeklyCounter}`, {
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

                setSchedules({
                  ...schedules, // copy the current state objecct
                  [`${weeklyCounter}`]: data,
                  // add the new schedule as a value for the 'Monday' key
                });
                setisLoading(false);
              })
              .catch((error) => {
                console.error('Error:', error);

              });
            setTimeout(() => {
              handleDeleteWorker();
            }, 1000);

          })

          .catch((error) => {
            console.error('Error:', error);

          });


      })
      .catch((error) => {
        console.error('Error:', error);

      });
  }
  ///////////////////// handle showing the update worker component
  const handleUpdateWorker = (updatedWorker) => {
    setWorker(updatedWorker);
    toggleOverlayUpdateWorker(); // close the overlay after updating the worker
  };

  ///////////////////// handle update worker overlay
  const toggleOverlayUpdateWorker = () => {
    setUpdateWorkerVisible(!updateWorkerVisible);
  };

  ////////////////// for closing the overlay
  const handleDeleteWorker = () => {
    ondeleteWorker();
  }

  return (

    <View style={styles.container}>
      <View>
        <Text style={styles.HeaderTXT}>Worker Details</Text>
      </View>

      <Image source={{ uri: `data:image/png;base64,${worker.Image}` }} style={styles.image} />
      <View style={styles.Detailview}>
        <Text style={styles.Label}>ID - </Text>
        <Text style={styles.DetailTxt}>{worker.Worker_Id}</Text>
      </View>
      <View style={styles.Detailview}>
        <Text style={styles.Label}>NAME - </Text>
        <Text style={styles.DetailTxt}>{worker.Name}</Text>
      </View>
      <View style={styles.Detailview}>
        <Text style={styles.Label}>EMAIL - </Text>
        <Text style={styles.DetailTxt}>{worker.Email}</Text>
      </View>
      <View style={styles.Detailview}>
        <Text style={styles.Label}>STARTED AT - </Text>
        <Text style={styles.DetailTxt}>{FormatDate(worker.Start_Date)}</Text>
      </View>
      <View style={styles.Detailview}>
        <Text style={styles.Label}>STATUS - </Text>
        <Text style={styles.DetailTxt}>
          {worker.Is_Manager === 1 ? 'Manager' : 'Not Manager'}
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
        <UpdateWorker worker={worker} onUpdateWorker={handleUpdateWorker}></UpdateWorker>

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
    flexDirection: 'row',
    justifyContent: 'center'
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
  Label: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#00BFFF',
    fontSize: 15

  },
  DetailTxt: {
    alignSelf: 'center',
    fontSize: 15
  }
});

