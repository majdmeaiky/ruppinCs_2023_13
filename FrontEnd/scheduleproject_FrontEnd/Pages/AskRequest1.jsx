import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import React, { useEffect, useState,useContext } from 'react';
import RadioGroup from 'react-native-radio-buttons-group';
import { Context } from '../Components/FCContext'

import { Button, Card } from '@rneui/themed';
import Header from '../Components/Header';
export default function ManagerMenu() {

    function getSunday1(date) {
        const sunday = new Date(date);
        sunday.setDate(new Date(date).getDate() - new Date(date).getDay());
        return sunday;
    };
    const { logInWorker,apiUrl} = useContext(Context);

    const startingforRequest = getSunday1(new Date ());
    startingforRequest.setDate(startingforRequest.getDate() + 7);
    const [startingDate, setStartingDate] = useState(startingforRequest);
    const [markedDates, setmarkedDates] = useState([]);

    const [selectedDate, setSelectedDate] = useState(startingforRequest);

    const [selectedTab, setSelectedTab] = useState(0);
    const [value, setValue] = useState('');
    const [requsts, setrequsts] = useState({[FormatDate(selectedDate)]:{"M":{},"E":{},"N":{}}});


    const onDateSelected = (date) => {
        if (ChechDayValid( requsts[FormatDate(selectedDate)]))
        {
            const add = {
                date : selectedDate,
                lines:[
                    {
                        color:'green',
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

    const UnMarkDate = () => {
        let markedUpdate=[];
        for (obj in markedDates) {
            if (obj.date != selectedDate) {
                markedUpdate.push(obj);
            }
        }
        return markedUpdate;
    }

    useEffect(() => {
       // const markedUpdate = UnMarkDate();
        let requestArr = { ...requsts };
        let shiftsPerDay = {
            ['M']: {},
            ['E']: {},
            ['N']: {}
        };
        const formattedDate = FormatDate(selectedDate);

        requestArr[formattedDate] = shiftsPerDay;

        setrequsts(requestArr);
        setRadioButtonsMorning (morningButtons);
        setRadioButtonsEvening(eveningButtons);
        setRadioButtonsNight(nightButtons);
      // setmarkedDates(markedUpdate);
    }, [selectedDate]);

    useEffect(() => {
      console.log('after request update',JSON.stringify(requsts));
    }, [requsts]);
//========== radio button state + handle
//morning
const morningButtons = [
    {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'want',
        value: 1,
        selected:false

    },
    {
        id: '2',
        label: 'Can',
        value: 2,
        selected:false
    },
    {
        id: '3',
        label: "Can't",
        value: 3,
        selected:false
       
    }
]
const [radioButtonsMorning, setRadioButtonsMorning] = useState(morningButtons);

function onPressRadioButtonMorning(getNewArr) {
    const update = [...getNewArr];
    setRadioButtonsMorning(update);
}
useEffect(() => {
    let requestArr = {...requsts};
    const formattedDate = FormatDate(selectedDate);
    
    console.log('objAtShift',requestArr[formattedDate]["M"]);
    let toAdd;
    if(radioButtonsMorning.find(button => button.selected)!== undefined)
    {
        toAdd = {
        "Worker_Id":"",
        "Company_Code": "",
        "priorety" : radioButtonsMorning.find(button => button.selected).value

    }
    requestArr[formattedDate]["M"] = toAdd
}
   
console.log('toAdd',toAdd);
    // const shiftType='M';
    // requestArr.formattedDate.shiftType =  radioButtonsMorning.find(button => button.selected);//.value;
    setrequsts(requestArr);
 
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
        value: '3'
    }
]
const [radioButtonsEvening, setRadioButtonsEvening] = useState(eveningButtons);

function onPressRadioButtonEvening(getNewArr) {
    const update = [...getNewArr]
    setRadioButtonsEvening(update);
}

useEffect(() => {
    let requestArr = {...requsts};
    const formattedDate = FormatDate(selectedDate);
    
    
    let toAdd;
    if(radioButtonsEvening.find(button => button.selected)!== undefined)
    {
        toAdd = {
        "Worker_Id":"",
        "Company_Code": "",
        "priorety" : radioButtonsEvening.find(button => button.selected).value

    }
    requestArr[formattedDate]["E"] = toAdd
}
   
console.log('toAdd',toAdd);
    // const shiftType='M';
    // requestArr.formattedDate.shiftType =  radioButtonsMorning.find(button => button.selected);//.value;
    setrequsts(requestArr);
 
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
        value: '3'
    }
]
const [radioButtonsNight, setRadioButtonsNight] = useState(nightButtons);

function onPressRadioButtonNight(getNewArr) {
    const update = [...getNewArr]
    setRadioButtonsNight(update);
}

useEffect(() => {
    let requestArr = {...requsts};
    const formattedDate = FormatDate(selectedDate);
    
    console.log('objAtShift',requestArr[formattedDate]["N"]);
    let toAdd;
    if(radioButtonsNight.find(button => button.selected)!== undefined)
    {
        toAdd = {
        "Worker_Id":"",
        "Company_Code": "",
        "priorety" : radioButtonsNight.find(button => button.selected).value

    }
    requestArr[formattedDate]["N"] = toAdd
}
   
console.log('toAdd',toAdd);
    // const shiftType='M';
    // requestArr.formattedDate.shiftType =  radioButtonsMorning.find(button => button.selected);//.value;
    setrequsts(requestArr);
 
}, [radioButtonsNight])

const ChechDayValid = (day)=>{
let counter =0;
let requestcounter = 0;
for (shift in day)
{
    if(day[shift]["priorety"] != undefined)
    {
        requestcounter++;
    }
    if (day[shift]["priorety"] <3)
    {
        counter ++;
    }
    
}
if ((counter >= 1) && (requestcounter ==3))
    {
        
        return true;
    }
    else {
    return false;
    }
}

const HandleSubmit = ()=>{
    let counter=0;
    let requestArr = [];
    let requestObj = {...requsts};
    let validDaysCounter =0;
    for (const day in requestObj)
    {
        const reqForDay = requestObj[day];
        if (ChechDayValid(reqForDay))
        {
            validDaysCounter++;
        }
        for (const shift in reqForDay)
        {
            const request = {
                'Worker_Id' : logInWorker.Worker_Id,
                'Company_Code' : logInWorker.Company_Code,
                'date' : day,
                'Type' : shift,
                'priorety' :reqForDay[shift]["priorety"]
            }
            requestArr.push(request);
        }
    }
    console.log('subimt',requestArr);   
    if (validDaysCounter >=5)
    {
    fetch(apiUrl+'RequestsFromClient', {
        method: 'POST',
        headers: new Headers({
            'Accept': 'application/json; charset=UTF-8',
            'Content-Type': 'application/json; charset=UTF-8',
    
        }),
        body: JSON.stringify(requestArr),
      })
        .then(res => {
          console.log(res);
        })
        .then((data) => {
        alert('requsts sent !');
    
        })
        .catch((error) => {
            console.error('Error:', error);
            
        });
   
    }
    else{
        alert ("your request is not valid");
    }
}

return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView>

            <View style={styles.container}>

                <Header></Header>
                <CalendarStrip
                    daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 3, borderHighlightColor: '#00BFFF' }}
                    minDate = {startingDate}

                    selectedDate={selectedDate}
                    onDateSelected={onDateSelected}
                    useIsoWeekday={false}
                    markedDates = {markedDates}
                    startingDate={startingDate} // Set to the most recent Sunday 
                    style={{ height: 150, paddingTop: 20, paddingBottom: 10 }}
                    highlightDateNameStyle={{ color: 'black' }}
                    highlightDateNumberStyle={{ color: 'black' }}
                />

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
        // F4C180
    },
    shiftview: {
        // borderColor:'lightgray',
        // borderWidth:1,
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