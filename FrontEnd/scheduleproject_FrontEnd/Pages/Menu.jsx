import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import React, { useEffect, useState, useContext } from 'react';
import SegmentedControlTab from "react-native-segmented-control-tab";
import SwipeButton from 'rn-swipe-button';
import { Card } from '@rneui/themed';
import EvilIcon from '@expo/vector-icons/EvilIcons'
import Header from '../Components/Header';
import { Context } from '../Components/FCContext';
import ButtonAddWorkerToShift from '../Components/ButtonAddWorkerToShift';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Overlay } from 'react-native-elements';
import Requests from '../Components/Requests';
import WorkerDetails from '../Components/WorkerDetails';


export default function Menu() {
    const { logInWorker, schedules, setSchedules, apiUrl } = useContext(Context);
    const [weeklyCounter, setWeeklyCounter] = useState(0);
    const [selecteddayoftheWeek, setselecteddayoftheWeek] = useState(Number);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startingDate, setStartingDate] = useState(getSunday1(selectedDate));
    const [selectedTab, setSelectedTab] = useState(0);
    const [shift, setShift] = useState('M');
    const [isLoading, setisLoading] = useState(false);
    const [vieworkerVisible, setVieworkerVisible] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [scheduleStr, setScheduleStr] = useState('');

    function getSunday1(date) {
        const sunday = new Date(date);
        sunday.setDate(new Date(date).getDate() - new Date(date).getDay());
        return sunday;
    };

    const onDateSelected = (date) => {
        setSelectedDate(date);
        setStartingDate(getSunday1(date));
        setselecteddayoftheWeek((new Date(date).getDay()));
    };

    const handleIndexChange = (tab) => {
        setSelectedTab(tab);
        if (tab == 0) {
            setShift('M');
        }
        else if (tab == 1) {
            setShift('E');
        } else {
            setShift('N');
        }
    };

    const toggleOverlayVieWorker = (worker) => {
        setSelectedWorker(worker);
        setVieworkerVisible(!vieworkerVisible);
    };

    const makeSchedule = () => {
        
             fetch(apiUrl + `Schedule/CreateSchedule?Company_Code=${logInWorker.Company_Code}&weeklycounter=${weeklyCounter}`, {
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
                    console.log(data);
                    const isEveryWorkerIdZero = data.every(item => item['Worker_Id'] === 0);

                    if (isEveryWorkerIdZero) {
                        // Show alert for every Worker_Id is equal to 0
                        setScheduleStr(<AwesomeAlert
                            show={true}
                            title="No Schedule Made!"
                            message="Cannot Make A Schedule That Matches The Requests."
                            icon="error"
                        />);
                    } else {
                        // Show alert for at least one Worker_Id is not equal to 0
                        setScheduleStr(<AwesomeAlert
                            show={true}
                            title="Schedule Made!"
                            message="Successfuly!"
                        />);
                    }
                    getSchedule((weeklyCounter));
                })

                .catch((error) => {
                    console.error('Error:', error);

                });
    
    };

    useEffect(() => {
        {
            schedules[`${weeklyCounter}`] == null &&

            setisLoading(true);
        }

        getSchedule(weeklyCounter);
    }, [weeklyCounter]);


    const getSchedule = (weeklyCounter1) => {
        fetch(apiUrl + `Schedule?Company_Code=${logInWorker.Company_Code}&week_counter=${weeklyCounter1}`, {
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

                console.log(data);
                // if (!schedules.hasOwnProperty(weeklyCounter)) {
                setSchedules({
                    ...schedules, // copy the current state objecct
                    [`${weeklyCounter}`]: data,
                    // add the new schedule as a value for the 'Monday' key
                });
                // }
                setisLoading(false);

            })

            .catch((error) => {
                console.error('Error:', error);

            });

    };
    const handleWeekChanged = (startDate) => {
        // console.log(startDate);
        // Get the starting date of the current week

        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const startingDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDay + 1);
        // console.log(startingDate);

        // Get the starting date of the previous week
        const prevWeekStartingDate = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() - 7);

        // Get the selected start date as a date object
        const startDateObj = new Date(startDate);

        // Calculate the difference in weeks between the selected date and the previous week's starting date
        const diffInWeeks = Math.floor((startDateObj - prevWeekStartingDate) / (7 * 24 * 60 * 60 * 1000));
        // console.log(diffInWeeks);
        // if (diffInWeeks === 1) {
        //     setShowSwipeButton(!showSwipeButton);
        // } else {
        //     setShowSwipeButton(false);

        // }
        // Update the weekly counter state
        setWeeklyCounter(diffInWeeks);

    };

    const deleteWorkerInShift=(worker)=>{
        console.log(worker.Company_Name);
        const Worker_Id = worker.Worker_Id;
        const Company_Name = worker.Company_Name;
        const Shift_Id = worker.Shift_Id;
        const workerobj = { Worker_Id, Company_Name, Shift_Id };
        fetch(apiUrl+`WorkerInShift`, {
            method: 'DELETE',
            headers: new Headers({
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json; charset=UTF-8',

            }),
            body: JSON.stringify(workerobj),

        })  
            .then(() => {
                fetch(apiUrl+`Schedule?Company_Code=${logInWorker.Company_Code}&week_counter=${weeklyCounter}`, {
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
alert('Deleted succecfuly');

                    })

                    .catch((error) => {
                        console.error('Error:', error);

                    });

            })

            .catch((error) => {
                console.error('Error:', error);

            });
};

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>

                <View style={styles.container}>

                    <Header></Header>

                    <CalendarStrip

                        daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 3, borderHighlightColor: '#00BFFF' }}
                        selectedDate={selectedDate}
                        onDateSelected={(date) => onDateSelected(date)}
                        useIsoWeekday={false}
                        startingDate={startingDate} // Set to the most recent Sunday 
                        style={{ height: 150, paddingTop: 20, paddingBottom: 10 }}
                        highlightDateNameStyle={{ color: 'black' }}
                        highlightDateNumberStyle={{ color: 'black' }}
                        onWeekChanged={(startDate, endDate) => handleWeekChanged(startDate)}

                    />

                    <SegmentedControlTab
                        tabsContainerStyle={{ margin: 20, marginBottom: 40, marginTop: 5, width: 400, height: 45, alignSelf: 'center' }}
                        activeTabStyle={{ backgroundColor: '#00BFFF' }}
                        values={["Morning", "Evenning", "Night"]}
                        selectedIndex={selectedTab}
                        onTabPress={handleIndexChange}
                    />

                    <View style={{ backgroundColor: 'black', width: '80%', height: 1, alignSelf: 'center', marginBottom: 10 }} />

                    {isLoading && <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 25 }} visible={isLoading} />}

                    {(() => {
                        try {
                            const scheduleExists = (
                                schedules[`${weeklyCounter}`] != null &&
                                schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()] != null &&
                                schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()][`${shift}`] != null &&
                                schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()][`${shift}`] != null &&
                                schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()][`${shift}`][0]["Shift_Id"] !== 0 &&
                                weeklyCounter >= 0 && logInWorker.Is_Manager == true
                            );

                            if (scheduleExists) {
                                return (
                                    <ButtonAddWorkerToShift DayOfWeek={selecteddayoftheWeek} shift={shift} Shift_Id={schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()][`${shift}`][0]["Shift_Id"]} weeklyCounter={weeklyCounter} selectedDate={selectedDate.toISOString()} ></ButtonAddWorkerToShift>
                                );
                            } else {
                                return null;
                            }
                        } catch (error) {
                            return <Card containerStyle={{ borderRadius: 10, height: 120, backgroundColor: '#E2F8F9' }}>
                                <View style={{ flexDirection: 'row', height: '100%' }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            style={{ width: '30%', height: '100%', marginRight: 50, backgroundColor: '#E2F8F9' }}
                                            source={require('../user.jpg')}
                                        />
                                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>No Worker Availible</Text>
                                        </View>
                                    </View>
                                </View>
                            </Card>;
                        }
                    })()}


                    {schedules[`${weeklyCounter}`] != null &&
                        schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()] != null &&
                        schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()][`${shift}`] != null && (
                            schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()][`${shift}`].map((item, index) => (
                                item['Worker_Id'] !== 0 ? (

                                    <Card containerStyle={{ borderRadius: 10, height: 120, backgroundColor: '#E2F8F9' }} key={index}>
                                        <View style={{ flexDirection: 'row', height: '100%' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                <TouchableOpacity onPress={() => { toggleOverlayVieWorker(item) }}>
                                                    <Image
                                                        style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10, marginRight: 30, backgroundColor: '#E2F8F9' }} source={{ uri: `data:image/png;base64,${item["Image"]}` }}
                                                    />
                                                </TouchableOpacity>
                                                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item["Name"]}</Text>
                                                </View>
                                                <TouchableOpacity style={{ marginRight:20 }} onPress={()=>deleteWorkerInShift(item)}>
                    <EvilIcon name='trash' size={50} color='black' ></EvilIcon>
                </TouchableOpacity>

                                            </View>
                                        </View>
                                    </Card>
                                ) : (<Card containerStyle={{ borderRadius: 10, height: 120, backgroundColor: '#E2F8F9' }} key={index}>
                                    <View style={{ flexDirection: 'row', height: '100%' }}>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                style={{ width: '30%', height: '100%', marginRight: 50, backgroundColor: '#E2F8F9' }}
                                                source={require('../user.jpg')}
                                            />
                                            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>No Worker Availible</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Card>
                                )


                            ))
                        )}




                    <View style={{ backgroundColor: 'black', width: '80%', height: 1, alignSelf: 'center', marginTop: 40, marginBottom: 10 }} />
                    <Requests weeklyCounter={weeklyCounter}></Requests>

                    {/* {showSwipeButton && schedules[`${weeklyCounter}`] != null && schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()] != null && schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()][`${shift}`] != null && schedules[`${weeklyCounter}`][selecteddayoftheWeek.toString()][`${shift}`].length == 0 &&  */}
                    {weeklyCounter >= 0 && logInWorker.Is_Manager == true && (<SwipeButton railBackgroundColor='lightgray'
                        railFillBackgroundColor="gray" //(Optional)
                        railFillBorderColor="#00BFFF" //(Optional)
                        thumbIconBackgroundColor='#00BFFF'
                        shouldResetAfterSuccess={true}
                        height={55}
                        title="Swipe For New Schedule"
                        borderRadius={70}
                        onSwipeSuccess={() => {
                            setShowAlert(!showAlert);
                        }}
                        resetAfterSuccess={true} />
                    )}

                </View>

            </ScrollView>
            <Overlay isVisible={vieworkerVisible} onBackdropPress={toggleOverlayVieWorker} overlayStyle={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <WorkerDetails worker={selectedWorker}></WorkerDetails>

            </Overlay>

            {logInWorker && <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={"New Schedule Alert!"}
                message={"Are You Sure?"}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Yes"
                cancelText="No"
                showCancelButton={true}
                confirmButtonColor="#00BFFF"
                onConfirmPressed={() => {
                    setShowAlert(!showAlert);
                    makeSchedule();
                }}
                onCancelPressed={() => {
                    setShowAlert(!showAlert);

                }}
            />}
            {scheduleStr}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1 }
});