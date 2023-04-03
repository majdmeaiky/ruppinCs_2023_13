import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import React, { useEffect, useState, useContext } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import { Context } from '../Components/FCContext'
import AlertPro from "react-native-alert-pro";
import { Button } from '@rneui/themed';
import Header from '../Components/Header';
import ShowRequests from '../Components/ShowRequests';
export default function AskRequest() {
    //////////////////////////////// get sunday of the wweek
    function getSunday1(date) {
        const sunday = new Date(date);
        sunday.setDate(new Date(date).getDate() - new Date(date).getDay());
        return sunday;
    };
    const { logInWorker, apiUrl } = useContext(Context);

    const startingforRequest = getSunday1(new Date());

    startingforRequest.setDate(startingforRequest.getDate() + 7);
    const dictDate = new Date(startingforRequest);
    /////////////////////// main state of all requests for current week
    const [requsts, setrequsts] = useState(
        {
            [FormatDate(dictDate.setDate(startingforRequest.getDate()))]: {
                ['M']: { "priorety": 3 },
                ['E']: { "priorety": 3 },
                ['N']: { "priorety": 3 }
            },
            [FormatDate(dictDate.setDate(startingforRequest.getDate() + 1))]: {
                ['M']: { "priorety": 3 },
                ['E']: { "priorety": 3 },
                ['N']: { "priorety": 3 }
            },
            [FormatDate(dictDate.setDate(startingforRequest.getDate() + 2))]: {
                ['M']: { "priorety": 3 },
                ['E']: { "priorety": 3 },
                ['N']: { "priorety": 3 }
            },
            [FormatDate(dictDate.setDate(startingforRequest.getDate() + 3))]: {
                ['M']: { "priorety": 3 },
                ['E']: { "priorety": 3 },
                ['N']: { "priorety": 3 }
            },
            [FormatDate(dictDate.setDate(startingforRequest.getDate() + 4))]: {
                ['M']: { "priorety": 3 },
                ['E']: { "priorety": 3 },
                ['N']: { "priorety": 3 }
            },
            [FormatDate(dictDate.setDate(startingforRequest.getDate() + 5))]: {
                ['M']: { "priorety": 3 },
                ['E']: { "priorety": 3 },
                ['N']: { "priorety": 3 }
            },
            [FormatDate(dictDate.setDate(startingforRequest.getDate() + 6))]: {
                ['M']: { "priorety": 3 },
                ['E']: { "priorety": 3 },
                ['N']: { "priorety": 3 }
            }
        }
    );
    const [startingDate, setStartingDate] = useState(startingforRequest);
    const [markedDates, setmarkedDates] = useState([]);
    const [canSubmit, setcanSubmit] = useState(false);
    const [selectedDate, setSelectedDate] = useState(startingforRequest);
    const [weeklyCounter, setWeeklyCounter] = useState(1);
    const [prevrequest, setprevrequest] = useState();
    const minDate = startingforRequest;
    const [requestSentStr, setRequestSentStr] = useState();
    const [requestnotValid, setRequestnotValid] = useState();


    //////////////////////// checking if there is prev requests for a worker and handle the disable of radio buttons
    const fetchRequests = () => {
        fetch(apiUrl + 'RequestsFromClient?Worker_Id=' + logInWorker.Worker_Id + '&Company_Name=' + logInWorker.Company_Name + '&weeklyCounter=' + weeklyCounter, {
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
                if (data.length == 0) {
                    setcanSubmit(false);
                }
                else {
                    setprevrequest(data);
                    setcanSubmit(true);
                }

            })

            .catch((error) => {
                console.error('Error:', error);

            });

    };
    ////////////// calling fetchRequest when moving to another week
    useEffect(() => {
        fetchRequests();
    }, [weeklyCounter])

    /////////////////////// initiallize a new dictionery for a new week
    const CreateDictionary = ((start) => {
        const startDate = new Date(start);
        const dictDate = new Date(startDate);
        const dict = {};

        for (let i = 0; i < 7; i++) {
            dictDate.setDate(startDate.getDate() + i);
            const formattedDate = FormatDate(dictDate);
            dict[formattedDate] = {
                ['M']: { "priorety": 3 },
                ['E']: { "priorety": 3 },
                ['N']: { "priorety": 3 }
            };
        }
        return dict;
    });

    /////////////////// calculate difference in weeks between 2 dates
    const DateDifference = (newDate, oldDate) => {
        const startNew = getSunday1(newDate);
        startNew.setHours(0, 0, 0, 1);
        const startOld = getSunday1(oldDate);
        startOld.setHours(0, 0, 0, 1);
        const diffInMs = Math.abs(startNew - startOld);
        const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
        if (startNew >= startOld) {
            return diffInWeeks;
        } else {
            return -1 * diffInWeeks;
        }
    };

    //////////////////// when selecting a date making a new dictionery and chacking valid day
    const onDateSelected = (date) => {
        const weekdiff = DateDifference(date, selectedDate);
        if (weekdiff != 0) {
            const initNewWeekRequest = CreateDictionary(getSunday1(date));
            setrequsts(initNewWeekRequest);
            setmarkedDates([]);
        }
        if (ChechDayValid(requsts[FormatDate(selectedDate)])) {
            const add = {
                date: selectedDate,
                lines: [
                    {
                        color: 'green',
                    }
                ]
            }
            let marked = [...markedDates];
            marked.push(add);
            setmarkedDates(marked);

        }
        setSelectedDate(date);
        setStartingDate(getSunday1(date));
    };


    function FormatDate(got_date) {
        const date = new Date(got_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const formattedMonth = String(month).padStart(2, "0");
        const formattedday = String(day).padStart(2, "0");
        const formattedDate = `${year}/${formattedMonth}/${formattedday}`;
        return formattedDate;
    }



    /////////////////////////// retrive each day requests
    useEffect(() => {
        const resetMorning = requsts[FormatDate(selectedDate)];
        const M = resetMorning['M']['priorety'];
        const E = resetMorning['E']['priorety'];
        const N = resetMorning['N']['priorety'];

        const arrM = [...morningButtons];
        const arrE = [...eveningButtons];
        const arrN = [...nightButtons];
        arrM.forEach(element => {
            if (element.value == M) {
                element.selected = true;
            }
        });
        arrE.forEach(element => {
            if (element.value == E) {
                element.selected = true;
            }
        });
        arrN.forEach(element => {
            if (element.value == N) {
                element.selected = true;
            }
        });
        setRadioButtonsMorning(arrM);
        setRadioButtonsEvening(arrE);
        setRadioButtonsNight(arrN);
    }, [selectedDate]);


    //========== radio button state + handle
    //morning
    const morningButtons = [
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'want',
            value: 1,
            // selected: false

        },
        {
            id: '2',
            label: 'Can',
            value: 2,
            // selected: false
        },
        {
            id: '3',
            label: "Can't",
            value: 3,
            // selected: false

        }
    ]
    const [radioButtonsMorning, setRadioButtonsMorning] = useState(morningButtons);

    ///////////////////// handle radio button press
    function onPressRadioButtonMorning(getNewArr) {
        const update = [...getNewArr];
        setRadioButtonsMorning(update);
    }
    //////////////////////// updates request state when selecting a shift
    useEffect(() => {
        let requestArr = { ...requsts };
        const formattedDate = FormatDate(selectedDate);
        try {

            let toAdd;
            if (radioButtonsMorning.find(button => button.selected) !== undefined) {
                toAdd = {
                    "Worker_Id": "",
                    "Company_Code": "",
                    "priorety": radioButtonsMorning.find(button => button.selected).value

                }
                requestArr[formattedDate]["M"] = toAdd;
            }

            setrequsts(requestArr);
        }
        catch {
            alert('oops! something went wrong');
            console.log('wrong', requestArr[formattedDate]["M"]);
        }


    }, [radioButtonsMorning])

    //evening
    const eveningButtons = [
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'want',
            value: '1'
        },
        {
            id: '2',
            label: 'Can',
            value: '2'
        },
        {
            id: '3',
            label: "Can't",
            value: '3',
            // selected:true
        }
    ]
    const [radioButtonsEvening, setRadioButtonsEvening] = useState(eveningButtons);

    function onPressRadioButtonEvening(getNewArr) {
        const update = [...getNewArr]
        setRadioButtonsEvening(update);
    }

    useEffect(() => {
        let requestArr = { ...requsts };
        const formattedDate = FormatDate(selectedDate);

        try {
            let toAdd;
            if (radioButtonsEvening.find(button => button.selected) !== undefined) {
                toAdd = {
                    "Worker_Id": "",
                    "Company_Code": "",
                    "priorety": radioButtonsEvening.find(button => button.selected).value

                }
                requestArr[formattedDate]["E"] = toAdd;
            }

            setrequsts(requestArr);
        }
        catch {
            alert('oops! something went wrong');
            console.log('wrong', requestArr[formattedDate]["E"]);
        }

    }, [radioButtonsEvening])
    //night
    const nightButtons = [
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'want',
            value: '1'
        },
        {
            id: '2',
            label: 'Can',
            value: '2'
        },
        {
            id: '3',
            label: "Can't",
            value: '3',
            // selected:true
        }
    ]
    const [radioButtonsNight, setRadioButtonsNight] = useState(nightButtons);

    function onPressRadioButtonNight(getNewArr) {
        const update = [...getNewArr]
        setRadioButtonsNight(update);
    }

    useEffect(() => {
        let requestArr = { ...requsts };
        const formattedDate = FormatDate(selectedDate);
        try {
            let toAdd;
            if (radioButtonsNight.find(button => button.selected) !== undefined) {
                toAdd = {
                    "Worker_Id": "",
                    "Company_Code": "",
                    "priorety": radioButtonsNight.find(button => button.selected).value

                }
                requestArr[formattedDate]["N"] = toAdd;
            }

            setrequsts(requestArr);
        }
        catch {
            alert('oops! something went wrong');
            console.log('wrong', requestArr[formattedDate]["N"]);
        }


    }, [radioButtonsNight])

    ///////////////////////////////// checking if there is at least one request priorerty not equal to 3
    const ChechDayValid = (day) => {
        let counter = 0;
        let requestcounter = 0;
        for (shift in day) {
            if (day[shift]["priorety"] != undefined) {
                requestcounter++;
            }
            if (day[shift]["priorety"] < 3) {
                counter++;
            }

        }
        if ((counter >= 1) && (requestcounter == 3)) {

            return true;
        }
        else {
            return false;
        }
    }

    ///////////////////////// convert dictionary to array and check if there is enough valid days and handle submit requests
    const HandleSubmit = () => {
        let requestArr = [];
        let requestObj = { ...requsts };
        let validDaysCounter = 0;
        for (const day in requestObj) {
            const reqForDay = requestObj[day];
            if (ChechDayValid(reqForDay)) {
                validDaysCounter++;
            }
            for (const shift in reqForDay) {
                const request = {
                    'Worker_Id': logInWorker.Worker_Id,
                    'Company_Code': logInWorker.Company_Code,
                    'date': day,
                    'Type': shift,
                    'priorety': reqForDay[shift]["priorety"]
                }
                requestArr.push(request);
            }
        }
        if (validDaysCounter >= 5) {
            fetch(apiUrl + 'RequestsFromClient',
                {
                    method: 'POST',
                    headers: new Headers({
                        'Accept': 'application/json; charset=UTF-8',
                        'Content-Type': 'application/json; charset=UTF-8',

                    }),
                    body: JSON.stringify(requestArr),
                })
                .then(res => {
                })
                .then((data) => {
                    setRequestSentStr(<AlertPro
                        ref={ref => {
                            this.AlertPro = ref;
                        }}
                        title="Request Sent"
                        message="Successfuly!"
                        showCancel={false}
                        showConfirm={false}
                        confirmText="OK"
                    />
                    );
                    try {
                        this.AlertPro.open();

                    }
                    catch { }
                    setcanSubmit(true);
                    fetchRequests();
                })
                .catch((error) => {
                    console.error('Error:', error);

                });

        }
        else {

            setRequestnotValid(<AlertPro
                ref={ref => {
                    this.AlertPro1 = ref;
                }}
                showConfirm={false}
                showCancel={false}
                title="Error"
                message="You Have To Enter Requests At Least For 5 Days!"
                confirmText="OK"
            />);
            try {
                this.AlertPro1.open();
            }
            catch {

            }
        }
    }

    //////////////////////// when moving to another week
    const handleWeekChanged = (startDate) => {
        // Get the starting date of the current week
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const startingDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDay + 1);
        // Get the starting date of the previous week
        const prevWeekStartingDate = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() - 7);
        // Get the selected start date as a date object
        const startDateObj = new Date(startDate);
        // Calculate the difference in weeks between the selected date and the previous week's starting date
        const diffInWeeks = Math.floor((startDateObj - prevWeekStartingDate) / (7 * 24 * 60 * 60 * 1000));
        // Update the weekly counter state
        setWeeklyCounter(diffInWeeks);
    };

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>

                <View style={styles.container}>

                    <Header></Header>
                    <CalendarStrip
                        daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 3, borderHighlightColor: '#00BFFF' }}
                        // maxDate={startingDate}
                        minDate={minDate}
                        selectedDate={selectedDate}
                        onDateSelected={onDateSelected}
                        useIsoWeekday={false}
                        onWeekChanged={(startDate, endDate) => handleWeekChanged(startDate)}

                        markedDates={markedDates}
                        startingDate={startingDate} // Set to the most recent Sunday 
                        style={{ height: 150, paddingTop: 20, paddingBottom: 10 }}
                        highlightDateNameStyle={{ color: 'black' }}
                        highlightDateNumberStyle={{ color: 'black' }}
                    />
                    {!canSubmit &&
                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <View style={styles.shiftview}>
                                <Text style={styles.shiftheader}>Morning</Text>
                                <RadioGroup
                                    radioButtons={radioButtonsMorning}
                                    onPress={onPressRadioButtonMorning}
                                    layout='row'
                                    containerStyle={styles.radio}
                                />
                            </View>
                            <View style={styles.shiftview}>
                                <Text style={styles.shiftheader}>Evenning</Text>
                                <RadioGroup
                                    radioButtons={radioButtonsEvening}
                                    onPress={onPressRadioButtonEvening}
                                    layout='row'
                                    containerStyle={styles.radio}
                                />
                            </View>
                            <View style={styles.shiftview}>
                                <Text style={styles.shiftheader}>Night</Text>
                                <RadioGroup
                                    radioButtons={radioButtonsNight}
                                    onPress={onPressRadioButtonNight}
                                    layout='row'
                                    containerStyle={styles.radio}
                                />
                            </View>
                            <Button
                                onPress={HandleSubmit}
                                title="Submit"
                                disabled={canSubmit}
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
                            />
                        </View>
                    }
                    {
                        (canSubmit && prevrequest) && <ShowRequests requests={prevrequest}></ShowRequests>
                    }
                    {requestSentStr}
                    {requestnotValid}
                </View>

            </ScrollView>
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    shiftheader: {
        color: '#364261',
        fontSize: 25,
        textAlign: 'center',
        marginBottom: 10
    },
    shiftview: {

        backgroundColor: '#E2F8F9',
        borderRadius: 10,
        marginBottom: 20,
        width: '90%',
        height: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    radio: {
        justifyContent: 'space-evenly',
    }
});