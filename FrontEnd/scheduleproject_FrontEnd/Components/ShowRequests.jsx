import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect,useState } from 'react'
import { View, Text ,StyleSheet} from 'react-native';
//npm install react-native-table-component
import { Table, Row, Rows } from 'react-native-table-component';

export default function ShowRequests(props) {
  const headers = ['Date', 'Morning', 'Evening', 'night'];
  const data = props.requests;
  const [requestdata, setrequestdata] = useState();
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
  function sortByDate(arr) {
    arr.sort(function (a, b) {
      return new Date(a[0]) - new Date(b[0]);
    });
    return arr;
  }
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
    console.log('dates', dates);
    console.log('grouped', grouped);

    dates.forEach((date) => {
      const m = grouped.find((item) => item.date === date).M;
      console.log('m is', m)
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
  }


  useEffect(() => {
    // let a= requestdata;
    console.log('ssssss',data);
    const result = groupByDateAndType(data);
    setrequestdata(result);

  }, []);




  return (
    <View>
      <View style={styles.container}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={headers} style={styles.head} textStyle={styles.text}/>
          <Rows data={requestdata} textStyle={styles.text}/>
        </Table>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});
