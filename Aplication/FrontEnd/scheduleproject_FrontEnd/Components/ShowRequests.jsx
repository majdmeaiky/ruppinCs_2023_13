import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Table, Row, Rows } from 'react-native-table-component';

///////////////////////////// component for showing requests of a worker in specifec week
export default function ShowRequests(props) {
  const headers = ['Date', 'Morning', 'Evening', 'night'];
  const data = props.requests;
  const [requestdata, setrequestdata] = useState();
  const [widthArr, setWidthArr] = useState([100, 100, 100, 100]);

  ///////////////// generates a string fom date
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

  //////////////// sort inner arrays by date
  function sortByDate(arr) {
    arr.sort(function (a, b) {
      return new Date(a[0]) - new Date(b[0]);
    });
    return arr;
  };

  ////////////////// group requests by date and type to array of arrays
  function groupByDateAndType(arr) {
    const grouped = arr.reduce((acc, curr) => {
      const { date, priorety, Type } = curr;
      const index = acc.findIndex((item) => item.date === date);
      if (index === -1) {
        acc.push({ date, [Type]: priorety });
      } else {
        acc[index][Type] = priorety;
      }
      return acc;
    }, []);

    const result = [];
    const dates = [...new Set(grouped.map((item) => item.date))];

    dates.forEach((date) => {
      const m = grouped.find((item) => item.date === date).M;
      const e = grouped.find((item) => item.date === date).E;
      const n = grouped.find((item) => item.date === date).N;
      const row = [date, m, e, n];
      result.push(row);
    });
    const sortedResult = sortByDate(result);
    const formatted_array = sortedResult.map(innerArr => {
      const date = new Date(innerArr[0]);
      const formattedDate = FormatDate(date);
      return [formattedDate, ...innerArr.slice(1)];

    });
    return formatted_array;
  };

  ///////// sets the requests of a worker to requestdata state to render the table
  useEffect(() => {
    const result = groupByDateAndType(data);
    setrequestdata(result);

  }, []);




  return (
    <ScrollView horizontal={true} >

      <View style={{ marginLeft: 15 }}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Row data={headers} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
        </Table>
        <ScrollView style={styles.dataWrapper}>

          <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
            <Rows widthArr={widthArr} data={requestdata} style={styles.row} textStyle={styles.text} />
          </Table>
        </ScrollView>

      </View>
    </ScrollView>

  )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#00BFFF' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: 'lightgrey' },
  text: { textAlign: 'center', fontWeight: '100', color: 'black', fontWeight: 'bold' },
});
