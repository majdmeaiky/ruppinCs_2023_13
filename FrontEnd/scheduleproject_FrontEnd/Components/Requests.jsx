import { Button } from '@rneui/base';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import { Context } from '../Components/FCContext'
import { SelectList } from 'react-native-dropdown-select-list'

export default function Requests(props) {
  const { logInWorker, apiUrl } = useContext(Context);
  const [requests, setRequests] = useState([]);
  const [tableHead, setTableHead] = useState(['Worker Name', 'Date', 'Type', 'Priorety']);
  const [widthArr, setWidthArr] = useState([110, 110, 110, 110]);
  const [visible, setVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [workersName, setWorkersName] = useState([]);
  const [selected, setSelected] = useState("");


  useEffect(() => {
    console.log(selected);
    if (requests.length > 0 && selected !== "") {
      const filteredRequests = requests.filter(request => request.Worker_Name === selected);

      const tableData = filteredRequests.map(request => [request.Worker_Name, request.date.substring(0, 10), request.Type, request.priorety]);
      setTableData(tableData);
    } else {
      setTableData([]);
    }
  }, [selected])

  useEffect(() => {
    setWorkersName([...new Set(requests.map((request) => request.Worker_Name))]);

  }, [requests]);




  const hide = () => {
    setVisible(!visible);
  };

  useEffect(() => {

    getrequests();

  }, [clicked == true])


  const getrequests = () => {
    fetch(apiUrl + `RequestsFromClient/WeeklyRequests?Company_Name=${logInWorker.Company_Name}&Weekly_Counter=${props.weeklyCounter}`, {
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
        setRequests(data);

      })

      .catch((error) => {
        console.error('Error:', error);

      });

  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      <Button radius={'sm'} type="solid" buttonStyle={{
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
        titleStyle={{ fontWeight: '700' }}
title='Show Requests'
        onPress={() => {
          // getrequests();
          setVisible(!visible);

          setClicked(!clicked);
        }}>

      </Button>
      <Overlay isVisible={visible} onBackdropPress={hide} overlayStyle={{ position: 'absolute', bottom: 0, width: '100%', height: '80%' }}>
        <Text style={{ fontSize: 25, alignSelf: 'center', marginTop: 10, marginBottom: 10, color: '#00BFFF' }}>Workers Requests For This Week</Text>

        <SelectList
          boxStyles={{ marginBottom: 20 }}
          placeholder='Please Select Worker:'
          setSelected={(val) => setSelected(val)}
          data={workersName.length > 0 && workersName}
          save="value"
          style={{ marginBottom: 20 }}
        />

        <ScrollView horizontal={true}>

          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
            </Table>

            <ScrollView style={styles.dataWrapper}>

              {(requests.length > 0) ? <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                {
                  tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={widthArr}
                      style={[styles.row]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>: <Text style={{fontSize:30,marginTop:50,marginLeft:50}}>*No Requests Availible*</Text>
}

            </ScrollView>

          </View>

        </ScrollView>


      </Overlay>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#00BFFF' },
  text: { textAlign: 'center', fontWeight: '100', color: 'black', fontWeight: 'bold' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: 'lightgrey' }
});

