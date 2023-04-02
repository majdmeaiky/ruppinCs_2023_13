import React, { useState, useContext, useEffect } from 'react'
import { Button, Card, Overlay } from '@rneui/themed';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { Context } from '../Components/FCContext'
import { ScrollView } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-elements';
import AlertPro from "react-native-alert-pro";

export default function ButtonAddWorkerToShift(props) {
    const { logInWorker, setlogInWorker, workers, setWorkers, schedules, setSchedules,apiUrl } = useContext(Context);
    const [search, setSearch] = useState('');

    const [visible, setVisible] = useState(false);
const [selecteddate, setSelecteddate] = useState();
const [dayOfWeek, setDayOfWeek] = useState('');
const [disabled, setDisabled] = useState(false);
const [workerAddeed, setWorkerAddeed] = useState('');

useEffect(() => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setDayOfWeek(weekdays[props.DayOfWeek.toLocaleString('en-US', {weekday: 'long'})]);
    console.log(dayOfWeek)});


// useEffect(() => { 
//     if (props.selectedDate !== undefined) {
//       const options = { weekday: 'long' };
//       const dayOfWeek = props.selectedDate.toLocaleDateString('en-US', options);
//       console.log(dayOfWeek); // output: Saturday
  
//       const shiftDate = new Date(props.selectedDate);
//       const shiftDateISOString = shiftDate.toISOString().slice(0, 10);
  
//       console.log(shiftDateISOString); // output: 2023-03-25
//       console.log(props.Shift_Id);
  
//       setSelecteddate(shiftDateISOString);
//       setStringDay(dayOfWeek);
//     }
//   }, [props.selectedDate, props.Shift_Id]);
  




    const toggleOverlayShowWorkers = () => {
        // alert(props.Shift_Id);
        // alert(props.weeklyCounter);
        console.log(props.selectedDate);


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
                // console.log(workerStr);

            })

            .catch((error) => {
                console.error('Error:', error);

            });
        setVisible(!visible);
    };

    const addWorkerToShift = (worker) => {
        setDisabled(!disabled);

        const Worker_Id = worker.Worker_Id;
        const Company_Name = worker.Company_Name;
        const Shift_Id = props.Shift_Id;
        const workerobj = { Worker_Id, Company_Name, Shift_Id };
        console.log(workerobj);
        fetch(apiUrl+`WorkerInShift`, {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json; charset=UTF-8',

            }),
            body: JSON.stringify(workerobj),

        })
            
            .then(() => {
                console.log(props.weeklyCounter);

                setWorkerAddeed(               <AlertPro
                    ref={ref => {
                        this.AlertPro = ref;
                    }}
                    title="New Worker Added"
                         message="Successfuly!"     
                                            showCancel={false}
                    showConfirm={false}
                    confirmText="OK"
                  />
                  
                  );
                  this.AlertPro.open();
                  
                fetch(apiUrl+`Schedule?Company_Code=${logInWorker.Company_Code}&week_counter=${props.weeklyCounter}`, {
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
                        setTimeout(() => {
                            setVisible(!visible);
                        }, 1000); // 1000 milliseconds = 1 second
        
                          
                        // alert('horray');
                        // console.log(data);
                        setSchedules({
                            ...schedules, // copy the current state objecct
                            [`${props.weeklyCounter}`]: data,
                            // add the new schedule as a value for the 'Monday' key
                        });
// alert('added succecfuly');

                    })

                    .catch((error) => {
                        console.error('Error:', error);

                    });

            })

            .catch((error) => {
                console.error('Error:', error);

            });
    };
    
    const filteredWorkers = search ? 
    workers.filter((worker) => worker.Name.includes(search)) :
    workers;

    const workerStr = filteredWorkers.map((worker) =>
        <TouchableOpacity disabled={disabled} onPress={() => { addWorkerToShift(worker) }}>
            <Card containerStyle={{ borderRadius: 10, height: 200, width: 150, margin: 22 }} >
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
                onPress={toggleOverlayShowWorkers}
            />

            <Overlay isVisible={visible} onBackdropPress={toggleOverlayShowWorkers} overlayStyle={{ position: 'absolute', bottom: 0, width: '100%', height: '80%' }}>
                <Text style={{ fontSize: 30, alignContent: 'center', marginTop: 10, marginLeft: 70, marginBottom: 10, color: '#00BFFF' }}>Add Worker To Shift</Text>
                <Text style={{fontWeight: 'bold', textAlign: 'center', justifyContent: 'center'}}>{props.selectedDate.substring(0, 10)} | {dayOfWeek} | {props.shift} </Text>

                <SearchBar inputStyle={{ backgroundColor: 'white' }}
                    containerStyle={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 5, margin: 10, width: 350, alignSelf: 'center' }}
                    onChangeText={setSearch}
                    value={search}
                />

                {workerAddeed}

                <ScrollView>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>{workerStr}</View>
                </ScrollView>
            </Overlay>


        </View>
    )
}
